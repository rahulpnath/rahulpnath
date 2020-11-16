---
author: [Rahul Nath]
title: "HOW TO: ZIP Multiple CSV Files In ASP.NET"
description: Learn how to generate a ZIP file containing many CSV files in an ASP.Net Web API application. The same approach is useful to zip files of any type in any .NET application using CSharp.
  
date: 2020-05-15
tags:
  - Programming
  - HowTo
thumbnail: ../images/how_to_create_zip_file_in_asp_net.jpg
---

Recently at a client, I had to generate many CSV files from an API endpoint. The user will download the CSV files as a ZIP archive file.

So here is one way to do it if you (including my future self) ever run into a similar functionality.

![How to create a zip file in ASP.NET](../images/how_to_create_zip_file_in_asp_net.jpg)

## Creating CSV File In-Memory

CSV files are a good option if you want to share data while allowing it to be opened in Excel or Google Sheets as well. Both are popular applications among the business and used by almost everyone.

In CSharp, the best way I have come across to generate a CSV file is to use [CsvHelper](https://joshclose.github.io/CsvHelper/)

> CSVHelper is a .Net library for reading writing CSV files. It is extremely fast, flexible, and easy to use.

CSVHelper is available as a NuGet package and easy to [get started](https://joshclose.github.io/CsvHelper/getting-started). I usually prefer representing the CSV file record as a CSharp class.

In this case, I had to generate multiple CSV files grouped by StoreName with delivery details for the day. The _DeliveryJobRecord_ represents on record in the CSV file.

```csharp
public class DeliveryJobRecord
{
    public string StoreName { get; set; }
    public string OrderNo { get; set; }
   ...
}
```

Using the CSVWriter class, generate a CSV file for a list of records.

In this case, I do not want any physical files on the server, so I am using the MemoryStream to generate the files. The [WriteRecords](https://joshclose.github.io/CsvHelper/getting-started#writing-a-csv-file) method on the CSVWriter writes out the data in CSV format to the memory stream.

```csharp
foreach (var store in storeGroup)
{
    byte[] bytes;
    using (var ms = new MemoryStream())
    {
        using (var writer = new StreamWriter(ms))
        {
            using (var csv = new CsvWriter(writer))
            {
                csv.WriteRecords(store.ToList());
            }
        }

        bytes = ms.ToArray();
    }

    deliveryFiles.Add(new File
    {
        Bytes = bytes,
        FileName = $"{store.Key} {deliveryDateTime:dd-MM-yyyy} - Delivery.csv"
    });
}
```

## Creating ZIP file In-Memory

Now that we have a list of delivery files in memory, which is a list of CSV files, add them to a ZIP archive.

To generate a zip file, use the ZipArchive class that is part of the System.IO.Compression namespace. It allows for creating a new ZipArchive by passing a stream. Since I intend to return the archive file in the same HTTP call, I am using a memory stream.

The [CreateEntry](https://docs.microsoft.com/en-us/dotnet/api/system.io.compression.ziparchive.createentry?view=netcore-3.1) function allows adding a new file to the zip archive. The function returns a [ZipArchiveEntry](https://docs.microsoft.com/en-us/dotnet/api/system.io.compression.ziparchiveentry?view=netcore-3.1), which allows writing the CSV files to it.

```csharp
var compressedFileStream = new MemoryStream();
using (var zipArchive = new ZipArchive(compressedFileStream, ZipArchiveMode.Create, true))
{
    foreach (var deliveryFile in deliveryFiles)
    {
        var zipEntry = zipArchive.CreateEntry(deliveryFile.FileName);

        using (var originalFileStream = new MemoryStream(deliveryFile.Bytes))
        using (var zipEntryStream = zipEntry.Open())
        {
            originalFileStream.CopyTo(zipEntryStream);
        }
    }
}

return new File()
{
    Bytes = compressedFileStream.ToArray(),
    FileName = $"Delivery Details.zip"
}
```

Looping around all the delivery files, add them to the ZipArchive. Zip files are binary data, so return [it as 'application/octet-stream'](https://www.iana.org/assignments/media-types/application/zip) in the API endpoint.

```csharp
[HttpGet]
public IActionResult DownloadDeliveriesForToday()
{
    var zipFile = GetZippedFile(DateTime.UtcNow);
    return File(zipFile.Bytes, "application/octet-stream", zipFile.FileName);
}
```

The full source code is available [here](https://github.com/rahulpnath/Blog/tree/master/ZippedCSVFiles)

The same approach applies to create archive files containing any file types. I hope this helps you with creating zip archive files in .NET applications using Csharp.
