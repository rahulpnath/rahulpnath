---
author: [Rahul Nath]
title: 'Custom Authorization Policy Providers in .Net Core For Checking Multiple Azure AD Security Groups'
date: 2019-03-29

tags:
  - Azure
  - Dotnet-Core
description: Extending Azure AD Groups Role based access to support combinations of multiple groups to grant access.
thumbnail: ../images/azure_ad_Groups.png
coverthumbnail: ../azure_ad_Groups.png
---

In the post, [.Net Core Web App and Azure AD Security Groups Role based access](https://www.rahulpnath.com/blog/dot-net-core-api-and-azure-ad-groups-based-access/), we saw how to use Azure AD Security Groups to provide Role Based Access for your .Net Core applications. We covered only cases where our Controllers/functions were provided access based on a single Azure AD Security group. At times you might want to extend this to include multiple groups, e.g., A user can edit an order if they belong to Admin OR Manager group or both Admin ANDManager group. In this post, we will see how to achieve that.

## Belongs to Multiple Groups

In the previous post, we added different policy per AD Security Group and used that in the _Authorize_ attribute to restrict access to a particular Security Group, say _Admin_. If you want to limit functionality to **users who belong to both Admin AND Manager**, you can use two attributes one after the other as shown below.

```csharp
[Authorize(Policy = "Admin")]
[Authorize(Policy = "Manager")]
[ApiController]
public partial class AddUsersController : ControllerBase
...
```

The above code looks for policies named 'Admin' and 'Manager', which we registered on application startup using the _services.AddAuthorization_ call (as shown in the [previous post](https://www.rahulpnath.com/blog/dot-net-core-api-and-azure-ad-groups-based-access/)).

## Belongs to Any One Group

In cases where you want to restrict access to a controller/function depending on the user being part of at least one of the groups in a list of given groups, e.g., **user is either Admin OR Manager**. The natural tendency is to use a comma-separated list of values for the Policy as shown below.

```csharp
[Authorize(Policy = "Admin,Manager")]
[ApiController]
public partial class AddUsersController : ControllerBase
...
```

The above code looks for a policy named _'Admin,Manager'_ and for it to work you need to add in a policy named the same.

```csharp
options.AddPolicy(
    "Admin,Manager",
    policy =>
        policy.AddRequirements(new IsMemberOfAnyGroupRequirement(adminGroup, managerGroup));
```

As you can see, I have modified the _IsMemberOfGroupRequirement_ class from the previous blog post to _IsMemberOfAnyGroupRequirement_, which now takes in a list of AzureAdGroupConfig. The handler for the requirement (_IsMemberOfAnyGroupHandler_) is updated to check if the user claims have at least one of the required claim.

```csharp
public class AzureAdGroupConfig
{
    public string GroupName { get; set; }
    public string GroupId { get; set; }
}

public class IsMemberOfAnyGroupRequirement : IAuthorizationRequirement
{
    public AzureAdGroupConfig[] AzureAdGroupConfigs { get; set; }

    public IsMemberOfAnyGroupRequirement(params AzureAdGroupConfig[] groupConfigs)
    {
        AzureAdGroupConfigs = groupConfigs;
    }
}

public class IsMemberOfAnyGroupHandler : AuthorizationHandler<IsMemberOfAnyGroupRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, IsMemberOfAnyGroupRequirement requirement)
    {
        foreach (var adGroupConfig in requirement.AzureAdGroupConfigs)
        {
            var groupClaim = context.User.Claims
            .FirstOrDefault(claim => claim.Type == "groups" &&
                claim.Value.Equals(
                    adGroupConfig.GroupId,
                    StringComparison.InvariantCultureIgnoreCase));

            if (groupClaim != null)
            {
                context.Succeed(requirement);
                break;
            }
        }

        return Task.CompletedTask;
    }
}
```

The code now works fine, and users belonging to either Admin OR Manager can now access the _AddUsersController_ functionality.

## Custom Authorization Policy Providers

Even though the above code works fine, we had to add a policy specific to _'Admin,Manager'_ combination. These combinations can soon start to grow in a large application and become hard to maintain. You can add a custom authorization attribute along with [customizing the policy retrieval](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/iauthorizationpolicyprovider?view=aspnetcore-2.2) to match our needs.

_IsMemberOFANyGroupAttribute_ is a custom authorize attribute that takes in a list of group names and concatenates the names using a known prefix and a separator. The known prefix, POLICY_PREFIX helps us to identify the kind of policy that we are looking at, given just the policy name.

**_Make sure to choose a SEPARATOR that you know will not be there in your group names._**

```csharp
public class IsMemberOfAnyGroupAttribute : AuthorizeAttribute
{
    public const string POLICY_PREFIX = "IsMemberOfAnyGroup";
    public const string SEPARATOR = "_";

    private string[] _groups;

    public IsMemberOfAnyGroupAttribute(params string [] groups)
    {
        _groups = groups;
        var groupsName = string.Join(SEPARATOR, groups);
        Policy = $"{POLICY_PREFIX}{groupsName}";
    }
}
```

To create a custom policy provider inherit from _IAuthorizationPolicyProvider_ or the default implementation available, _DefaultAuthorizationPolicyProvider_. Since I wanted to fall back to the default policies available first and then provide custom policies, I am inheriting from _DefaultAuthorizationPolicyProvider_. The only parameter available to us is the _policyName_, which is used to resolve the appropriate policy. The code first checks for any default policies available, those which are explicitly registered. I assume any policies referred to by the default _Authorize_ attribute will have an associated Policy registered explicitly. For policies with the
known prefix, POLICY_PREFIX we extract out the group names and build a new _IsMemberOfAnyGroupRequirement_ dynamically.

```csharp
public class ADGroupsPolicyProvider : DefaultAuthorizationPolicyProvider
{
    private List<AzureAdGroupConfig> _adGroupConfigs;

    public ADGroupsPolicyProvider(
        IOptions<AuthorizationOptions> options,
        List<AzureAdGroupConfig> adGroupConfigs): base(options)
    {
        _adGroupConfigs = adGroupConfigs;
    }

    public override async Task<AuthorizationPolicy> GetPolicyAsync(string policyName)
    {
        var policy = await base.GetPolicyAsync(policyName);

        if (policy == null &&
            policyName.StartsWith(
                IsMemberOfAnyGroupAttribute.POLICY_PREFIX,
                StringComparison.InvariantCultureIgnoreCase))
        {
            var groups = policyName
                .Replace(IsMemberOfAnyGroupAttribute.POLICY_PREFIX, string.Empty)
                .Split(
                    new string[] { IsMemberOfAnyGroupAttribute.SEPARATOR },
                    StringSplitOptions.RemoveEmptyEntries);

            var groupConfigs = (from groupName in groups
                                  join groupConfig in _adGroupConfigs
                                  on groupName equals groupConfig.GroupName
                                  select groupConfig)
                                 .ToArray();

           policy = new AuthorizationPolicyBuilder()
                .AddRequirements(new IsMemberOfAnyGroupRequirement(groupConfigs))
                .Build();
        }

        return policy;
    }
}
```

Don't forget to register the new policy provider at Startup.

```csharp
services.AddSingleton<IAuthorizationPolicyProvider, ADGroupsPolicyProvider>();
```

Using the new attribute is the same as before. However, you don't need to register a policy for _'Admin,Manager'_ explicitly. When the default policy provider cannot find a policy, it will return a dynamic policy with IsMemberOfAnyGroupRequirement having the above two groups. For any of the possible group combinations, this will happen automatically now.

```csharp
[IsMemberOfAnyGroupAttribute("Admin", "Manager")]
[ApiController]
public partial class AddUsersController : ControllerBase
```

Hope this helps you extend the Policy-based authorization in ASP.Net Core applications and mix and match with the way you want to enable access for your users.
