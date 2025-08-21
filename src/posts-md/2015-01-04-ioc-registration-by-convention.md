---
title: IoC Registration by Convention
slug: ioc-registration-by-convention
date_published: 2015-01-03T18:03:17.000Z
date_updated: 2022-10-10T05:50:28.000Z
tags: Dotnet
---

Sometime back we had seen, how to [configure the unity container using code/config file](__GHOST_URL__/blog/configuring-unity-container-comparing-code-and-xml-configuration-side-by-side/) and I was using a mix of this in one of my projects. This approach soon became an overhead, as the manual wiring up of registrations is really cumbersome and also error prone. Mostly there were missing registrations only to be found out, when doing test runs or deployments. We soon were forced to move out of the manual registration and find a new way to register dependencies.

The below image by [Mark Seemann](https://twitter.com/ploeh) sums it all up on when and how to use a Dependency Injection(DI) container and we were right at the bottom, where the whole purpose of a DI becomes pointless.
[![](__GHOST_URL__/content/images/ioc_usefulness.png)](http://bit.ly/1zLiq6p)
## Convention Over Configuration

[Convention over configuration](http://en.wikipedia.org/wiki/Convention_over_configuration), is very popular today and there are already many frameworks that have adopted it e.g. MVC, Web Api. Following the same approach would make life much simpler and registration less painful as dependencies would get auto registered, if the convention is followed. Conventions could vary across projects/teams, so it is up to the team to decide on the conventions that are to be followed and have all the developers follow them religiously.

Currently our registration process picks up all the assemblies from the base path and iterates through all the classes that are under the project/application namespace and gets the interfaces out of them and registers them. For interfaces that have multiple definitions we perform named registration based on the class name or name from an attribute on the class or both.

We are using Unity as the IoC container and it does support [convention based registrations](http://msdn.microsoft.com/en-us/library/dn507479(v=pandp.30).aspx) out of the box. You can either use the RegisterTypes method or the RegistrationConvention class to specify the conventions. The parameters in both of these approaches enable you to specify the types to register, the mappings to create, the name to use and lifetime. Since in our registration we wanted to use the named convention only in cases where there where multiple registrations for the same interface and the other interfaces were to be registered without any name this default convention had to be modified. Also we did not want to get tightly bound to the IoC container (just in case we want to swap out the container provider) and hence thought of having the convention logics in a separate class and have them registered to the container of choice.

The *GetClassesFromAssemblies* function iterates over the assemblies from the base application path(bin folder) to get all the dll's used and gets the classes that belong to the namespaces that we want to register. Alternatively you could also pass a list of assemblies if required to be used for the convention. If you want other namespaces too you can filter those in here.

    private static IEnumerable<Type> GetClassesFromAssemblies(IEnumerable<Assembly> assemblies = null)
    {
        var allClasses = assemblies != null ? AllClasses.FromAssemblies(assemblies) : AllClasses.FromAssembliesInBasePath();
        return
            allClasses.Where(
                n =>
                    n.Namespace != null
                    && n.Namespace.StartsWith(ApplicationNamespace, StringComparison.InvariantCultureIgnoreCase));
    }
    

For each of the type that is returned from the above method we get the list of interfaces that are defined on the type and needs to be registered against the type. In the sample code, I have added a couple of variations of registrations.

- *IFooBar* : Has only one implementation
- *IFoo* : Has multiple implementations and should be resolved using *IFooFactory*
- *IFooCustom* : Has multiple implementations and needs to have a custom name (maybe for some reason you do not want the context information to be part of the class name). This is to be resolved using IFooCustomFactory.
- `IFooGeneric<T>` : This is a generic implementation and the type can be decided at runtime.

The *GetInterfacesToBeRegistered* function gets the interfaces that are to be registered for a given type. For this convention I want to [get only the direct interfaces](http://stackoverflow.com/questions/5318685/get-only-direct-interface-instead-of-all) that are on the given type and not all the interfaces. The check below for *isGenericType* on an interface is for *IFooGeneric* as for generic interfaces the [GetInterfaces does not return the full information required](http://stackoverflow.com/questions/3117090/getinterfaces-returns-generic-interface-type-with-fullname-null) and we need to use the *GetGenericTypeDefinition* method instead.

    private static IEnumerable<Type> GetInterfacesToBeRegistered(Type type)
    {
        var allInterfacesOnType = type.GetInterfaces()
            .Select(i => i.IsGenericType ? i.GetGenericTypeDefinition() : i).ToList();
    
        return allInterfacesOnType.Except(allInterfacesOnType.SelectMany(i => i.GetInterfaces())).ToList();
    }
    

Once we have the interfaces for the type, we add them to an internal mapping list to register it all into the unity container. The internal mapping is against the interface type definition and has the list of classes that implements the interface.Now that we have all the types and interfaces to be registered, we need to register them into the container. For any interface that has only one type implementing it, we register it with default name else we get the name from the class name or the attribute that decorates the class if any.

    private static void RegisterConventions(IUnityContainer container)
    {
        foreach (var typeMapping in internalTypeMapping)
        {
            if (typeMapping.Value.Count == 1)
            {
                var type = typeMapping.Value.First();
                container.RegisterType(typeMapping.Key, type);
            }
            else
            {
                foreach (var type in typeMapping.Value)
                {
                    container.RegisterType(typeMapping.Key, type, GetNameForRegsitration(type));
                }
            }
        }
    }
    

The dependency with UnityContainer with the IoCConveniton class, can be easily removed by having an adapter interface into any container. To keep things simple I am having the direct dependency on the container in the sample. From the console application we can create a new container and use the convention class to register the dependencies. The factory implementations have the expected class conventions inside them that would be used to resolve the dependencies. Since the factory is part of the composition root I am using a [container based factory](http://blog.ploeh.dk/2012/03/15/ImplementinganAbstractFactory/), to resolve the dependencies.

    IUnityContainer unityContainer = new UnityContainer();
    IoCConvention.RegisterByConvention(unityContainer);
    

This has really taken off a lot of work for all the developers in the team and registrations of dependencies works seamlessly. You can find the sample convention implementation [here](https://github.com/rahulpnath/Blog/tree/master/IocConventionRegistration). Are you using convention registrations in your applications? If not you should start using them.
