---
date: 2014-01-21 07:55:25+00:00
slug: windows-phone-series-incremental-loading-multiple-data-sources-inside-a-pivot
author: [Rahul Nath]
title: Windows Phone Series – Incremental Loading multiple data sources inside a Pivot
wordpress_id: 870
tags:
  - Windows Phone
thumbnail: ../images/WP_IncrementalLoading.png
---

We had seen on how [incremental loading can be done in a Windows phone](http://rahulpnath.com/blog/windows-phone-series-incremental-loading/), so that data can be fetched as user scrolls down the available data. This is important for data sources that have a large amount of data and when all of these cannot be loaded at once. I have been getting queries on how to implement this for a Pivot control ,in which each pivot item would bind with multiple data sources or endpoints.

An ideal example for this would be the [500px api](http://developers.500px.com/), where we have photos categorized into different streams and each one of them can be in a pivot item. Since we have been talking about [mvvm](http://rahulpnath.com/blog/tag/mvvm/), all along will implement this using MVVM.

![image](../images/WP_IncrementalLoading.png)

In the sample application here, I have created 2 projects – PCL and Windows Phone project, just for showing the code separation that can be achieved using MVVM. The PCL can be reused with Windows 8 too to develop a similar application, with a few minor tweaks. We would see how we can incrementally load each of these pivot items as and when the user scrolls down on the list of photos.

In the MainViewModel, we create ViewModel’s for each of the PivotItem, which are instances of PhotoCollectionViewModel. Each of these PhotoCollectionViewModel represents a photo stream of 500px, which is defined as a static collection of string. You can add on to this the other streams available in the 500px api to have them displayed too.

```csharp
private static string[] photoCollections =
{
    "popular",
    "upcoming",
    "editors",
    "fresh_today"
};

public List PhotoCollectionViewModels { get; set; }

public MainViewModel()
{
    PhotoCollectionViewModels = new List();
    foreach (var photoCollection in photoCollections)
    {
        this.PhotoCollectionViewModels.Add(new PhotoCollectionViewModel(photoCollection));
    }
}
```

In the PhotoCollectionViewModel, we create the url from which the data needs to be  fetched from the api, along with the api consumer key, which can be obtained by [registering an application here](http://500px.com/settings/applications) and assign the url to a IncrementalLoader, that will take care of incrementally loading the data and returning it to the ViewModel. The url has a placeholder for the current page number(**_page={0}_**) that would be populated by the IncrementalLoader on each load.

The IncrementalLoader is a generic class that takes in url from which it has to load the data and returns the generic type that it is assigned to on each LoadNextPage request.

```csharp
public class IncrementalLoader<T> where T : class
{
    private string BaseUrl;

    private int CurrentPageNumber;

    private bool isCurrentlyLoading;

    private string CurrentUrl
    {
        get
        {
            return string.Format(this.BaseUrl, ++this.CurrentPageNumber);
        }
    }

    public IncrementalLoader(string baseUrl)
    {
        this.BaseUrl = baseUrl;
    }

    public async Task<T> LoadNextPage()
    {
        if (this.isCurrentlyLoading)
        {
            // call in progress
            return null;
        }

        this.isCurrentlyLoading = true;
        HttpClient client = new HttpClient();

        // Add Microsoft.Bcl.Async nuget for await to work on PCL.

        var response = await client.GetStringAsync(this.CurrentUrl);
        var serializer = new DataContractJsonSerializer(typeof(T));
        var returnObject = serializer.ReadObject(new MemoryStream(Encoding.Unicode.GetBytes(response))) as T;
        this.isCurrentlyLoading = false;

        return returnObject;
    }

}
```

In the Main page, the view Model is bound to a Pivot control, which has the templates specified for displaying the list of PhotoCollectionViewModels.

```xml

<Grid x:Name="ContentPanel" Grid.Row="1" >
    <phone:Pivot Name="photoCollection" ItemsSource="{Binding PhotoCollectionViewModels}">
    <phone:Pivot.ItemTemplate>
        <DataTemplate>
            <phone:LongListSelector ItemRealized="Photo_Loaded" ItemsSource="{Binding Photos}" IsGroupingEnabled="False">
                <phone:LongListSelector.ItemTemplate>
                    <DataTemplate>
                        <Image Source="{Binding image_url}" Margin="10" Width="500" />
                    </DataTemplate>
                </phone:LongListSelector.ItemTemplate>
            </phone:LongListSelector>
        </DataTemplate>
    </phone:Pivot.ItemTemplate>
    <phone:Pivot.HeaderTemplate>
        <DataTemplate>
            <TextBlock Text="{Binding Title}" />
        </DataTemplate>
    </phone:Pivot.HeaderTemplate>
    </phone:Pivot>
</Grid>

```

In the ItemRealized method of the LongListSelector, we decide on whether to load the next page of data or not, based on the current item that gets realized. We load the data if the item realized is third from the last in the current list of photos.We connect the ItemRealized method to the ViewModel code in the code behind.

```csharp
private void Photo_Loaded(object sender, ItemRealizationEventArgs e)
{
    LongListSelector longList = sender as LongListSelector;
    PhotoCollectionViewModel vm = longList.DataContext as PhotoCollectionViewModel;

    vm.LoadMorePhotos(e.Container.Content as Photo);
}

public async Task LoadMorePhotos(Photo currentPhoto)
{
    if (currentPhoto != null)
    {
        var index = this.Photos.IndexOf(currentPhoto);
        if (this.Photos.Count - 3 > index)
        {
            return ;
        }
    }
    this.currentCollection = await this.incrementalLoader.LoadNextPage();

    foreach (var photo in this.currentCollection.photos)
    {
        this.Photos.Add(photo);
    }
}
```

Whenver a user scrolls on a pivot the corresponding, ItemRealized methods gets called from which we call on to the load the data for that PhotoCollectionViewModel. This way each of the pivots are incrementally loaded as required.

The code for this is available [here](https://github.com/rahulpnath/Blog/tree/master/IncrementalLoading). Make sure you register for an application in the 500px api portal to get a consumer key that needs be updated in the solution for it to run.
