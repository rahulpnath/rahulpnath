---
title: Enable Versioning on Your Amazon S3 Buckets
slug: amazon-s3-versioning-dotnet
date_published: 2024-07-11T02:44:21.000Z
date_updated: 2024-07-11T02:44:21.000Z
tags:
  - AWS
excerpt: >
  Amazon S3 versioning is a powerful feature that allows you to preserve, retrieve, and restore every version of every object in your bucket. 
  In this post, let’s explore S3 versioning and how to use it when building .NET applications.
---

Amazon S3 versioning is a powerful feature that allows you to preserve, retrieve, and restore every version of every object in your bucket. 

Versioning is crucial for protecting against accidental deletions, maintaining audit trails, and implementing robust data retention strategies.

In this post, let’s explore S3 versioning and how to use it when building .NET applications. 

We will first explore a simple Create Read Update and Delete API over S3 and see how turning on versioning on S3 changes some of the behaviors and advantages you get.

AWS sponsors this post, and it is part of my AWS Series.

## Enabling Versioning on Amazon S3 Bucket

By default, versioning is disabled when creating a new bucket in S3. 
![](__GHOST_URL__/content/images/2024/07/image-1.png)AWS console showing an S3 bucket with versioning disabled, which is the default choice.
You can enable versioning while creating a new or existing bucket with objects.

Buckets can be in one of the three states:

- Unversioned (the default)
- Versioning-enabled
- Versioning-suspended.

⚠️

*Once versioning is enabled on a bucket, it can never return to an unversioned state.*

When enabling versioning in a bucket, all new objects are versioned and given a unique version ID. Objects existing in the bucket will get a version ID only when future requests modify them.
![](__GHOST_URL__/content/images/2024/07/image-2.png)AWS Console showing S3 bucket with bucket versioning turned on.
Each version of an object is considered a separate object and charged according to the [S3 pricing rules](https://aws.amazon.com/s3/pricing/).

If you are new to Amazon S3 and want to learn how to use it from a .NET application, check out the article below to familiarize yourself with the [AWSSDK.S3](https://www.nuget.org/packages/AWSSDK.S3) Nuget package.
[

Amazon S3 For the .NET Developer: How to Easily Get Started

Learn how to get started with Amazon S3 from a .NET Core application. We will learn how to store and retrieve data from the storage, important concepts to be aware of while using S3.

![](__GHOST_URL__/content/images/size/w256h256/2022/10/logo-512x512.png)Rahul NathRahul Pulikkot Nath

![](__GHOST_URL__/content/images/size/w1200/storage-box.jpg)
](__GHOST_URL__/blog/amazon-s3-dotnet/)
## Versioning and Adding Files

When working with an Amazon S3 bucket with versioning turned on, you can add files just like you would to a non-versioned bucket. 

Below is a sample ASP minimal API endpoint that takes in a File from the request and uploads it to S3. 

    app.MapPost("/upload-file", async (
            [FromForm] FileUploadRequest request, 
            IAmazonS3 s3Client) =>
        {
            await s3Client.PutObjectAsync(new PutObjectRequest()
            {
                BucketName = bucketName,
                Key = request.File.FileName,
                InputStream = request.File.OpenReadStream()
            });
            return Results.NoContent();
        })

The code uses the `PutObjectAsync` method and passes a `PutObjectRequest` with the appropriate bucket details, object name, and contents to upload the file. 

💡

*Every object written to an S3 bucket has an associated *[`*VersionId*`](https://docs.aws.amazon.com/AmazonS3/latest/userguide/versioning-workflows.html#version-ids)*. For a non-versioned bucket, this is set to null by default. *

When a bucket is versioned, S3 auto-generates a unique VersionId.

Version IDs are Unicode, UTF-8 encoded, URL-ready, opaque strings that are no more than 1,024 bytes long.

The uniqueness of an object in a versioned object is based on the combination of the object key and the VersionId. 
![](__GHOST_URL__/content/images/2024/07/image-3.png)AWS Console showing an S3 bucket with multiple versions of an object.
## Versioning and Getting Files

Getting files from a versioned S3 bucket works similarly to a non-versioned bucket.

The code below is a sample ASP NET minimal API endpoint that retrieves a file from S3 given a bucket name, key, and an optional versionId.

    app.MapGet("/get-file", async (
            string key, string? versionId,
            IAmazonS3 s3Client, HttpResponse response) =>
        {
            var fileObject = await s3Client.GetObjectAsync(
                new GetObjectRequest()
                {
                    BucketName = bucketName,
                    Key = key,
                    VersionId = versionId
                });
                
            response.ContentType = "application/octet-stream";
            response.Headers.Append(
                $"Content-Disposition", 
                $"attachment; filename={fileObject.Key}");
            var responseStream = response.BodyWriter.AsStream();
            await fileObject.ResponseStream.CopyToAsync(responseStream);
        })

When the versionId is null, it retrieves the latest version of the given key if it exists. 

You can also retrieve a specific version of an object by giving in the key and the associated versionId.

### Get All Versions for a File

You can retrieve all the versions of the object if required for a given key in a bucket. 

This allows one to navigate the different versions of the object for that key.

    app.MapGet("/get-file-versions", async (
            string key, IAmazonS3 s3Client) =>
        {
            var fileObject = await s3Client
                .ListVersionsAsync(
                    new ListVersionsRequest()
                    {
                        BucketName = bucketName,
                        Prefix = key
                    });
            return fileObject.Versions
                .Select(a => new
                {
                    a.BucketName, a.Key, 
                    a.VersionId, a.IsLatest, 
                    a.IsDeleteMarker
                });
        })

The `ListVersionsAsync` method can be used by passing in the `ListVersionsRequest` object with the bucket name and a Prefix attribute. 

Two important properties on the returned list of `Versions` are 

- `IsLatest` → Indicates whether this is the latest version.
- `IsDeleteMarker` → Indicates whether it is a Delete Marker (more on this later)

## Versioning and Deleting Files

Deleting a file in a non-versioned S3 bucket deletes it forever, and you cannot retrieve it.

However, a delete on a versioned S3 bucket only inserts a new object against the key as a delete marker, becoming the latest version for that object. It does not delete the actual file but maintains a version of it.

    app.MapDelete("/delete-file", 
            async (
                string fileName, string? versionId, IAmazonS3 s3Client) =>
        {
            await s3Client.DeleteObjectAsync(new DeleteObjectRequest()
            {
                BucketName = bucketName,
                Key = fileName,
                VersionId = versionId
            });
            return Results.NoContent();
        })

Performing a `GET` Object request when the current version is a delete marker returns a 404 Not Found error, very similar to how it would work on a non-versioned S3 bucket. 

However, you can pass in a specific versionId to retrieve a previous version of the file before it was deleted.

💡

*To permanently delete an object in a version-enabled S3 bucket, you must pass the key along with the version id.*

If you call delete on a file multiple times, it'll insert a new delete marker each time you call the function.

### Delete a Versioned File

By passing in an explicit versionId in the `DeleteObjectRequest`, you can delete a versioned object forever. 

This deletes the file forever from the S3 bucket, very similar to deleting a file in a non-versioned bucket. 

Deleting the latest version of an object by passing the versionId explicitly deletes that specific object and puts the previous version as the latest version. 

So, if you delete a delete marker on a file that is currently the latest version, it will revert to the previous version of the file before deleting it. 
