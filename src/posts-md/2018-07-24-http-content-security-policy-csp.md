---
title: HTTP Content Security Policy (CSP)
slug: http-content-security-policy-csp
date_published: 2018-07-24T00:00:00.000Z
date_updated: 2024-11-28T03:30:52.000Z
tags: Programming
excerpt: Prevent execution of malicious content in the context of your website.
---

*This article is part of a series of articles - [Ok I have got HTTPS! What Next?](__GHOST_URL__/blog/ok-i-have-got-https-what-next/). In this post, we explore how to use HSTS security header and the issues it solves.*

Content Security Policy (CSP) is a security response header or a `<meta>` element that instructs the browser, sources of information that it should trust for our website. A browser that supports CSP's then treats this list specified as a whitelist and only allows resources to be loaded only for those sources. CSP's allow you to specify source locations for a variety of resource types which are referred to as [fetch directives](https://developer.mozilla.org/en-US/docs/Glossary/Fetch_directive)(e.g. _script-src, img-src,style-src* etc).
![Content Security Policy](__GHOST_URL__/content/images/content-security-policy.png)
CSP is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement or distribution of malware.

    Content-Security-Policy: default-src 'self' *.rahulpnath.com
    

## Setting CSP Headers

### Web Server Configuration

CSP's can be set via the configuration file of your web server host if you want to specify it as part of the header. In my case I use Azure Web App, so all I need to do is add in a web.config file to my root with the header values. Below is an example which specified CSP headers (including Report Only) and [STS headers](__GHOST_URL__/blog/http-strict-transport-security-sts-or-hsts/).

    <configuration>
      <system.webServer>
        <httpProtocol>
          <customHeaders>
            <add name="Content-Security-Policy" value="upgrade-insecure-requests;"/>
            <add name="Content-Security-Policy-Report-Only" value="default-src 'none';report-uri https://rahulpnath.report-uri.com/r/d/csp/reportOnly" />
            <add name="Strict-Transport-Security" value="max-age=31536000; includeSubDomains; preload"/>
          </customHeaders>
        </httpProtocol>
        ...
    

### Using Fiddler

However if all you want is to play around with the CSP header and don't have access to your Web server or the configuration file, you can still test these headers. You can inject in the headers into the response using a [Web Proxy like Fiddler](__GHOST_URL__/blog/fiddler-free-web-debugging-proxy/)

To modify the request/response in-flight you can use one of the most powerful feature in Fiddler - [Fiddler Script](https://www.telerik.com/blogs/understanding-fiddlerscript)

> Fiddler Script allows you to enhance Fiddler’s UI, add new features, and modify requests and responses “on the fly” to introduce any behavior you’d like.

Using the below script, we can inject 'Content-Security-Policy' header whenever the request matches a specific criteria.
![Fiddler Script to update CSP](__GHOST_URL__/content/images/https_csp_fiddler_script.png)
    // Fiddler Script - Inject CSP Header
    if (oSession.HostnameIs('rahulpnath.com')) {
      oSession.oResponse.headers['Content-Security-Policy'] =
        "default-src 'none'; img-src 'self';script-src 'self';style-src 'self'";
    }
    

By injecting these headers, we can play around with the CSP headers for the webiste without affecting other users. Once you have the CSP rules that cater to your site you can commit this to the actual website. Even with all the CSP headers set, you can additionally set the [report-to](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to) (or deprecated [report-uri](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-uri)) directive on the policy to capture any policies that you may have missed.

## Content-Security-Policy-Report-Only

The *Content-Security-Policy_Report-Only* header allows to test the header settings without any impact and also to capture any CSP headers that you might have missed on your website. The browser uses this for reporting purposes only and does not enforce the policies. We can specify a report endpoint to which the browser will send any CSP violations as a JSON object.

Below is an example of a CSP violation POST request send from the browser to the report URL that I had specified for this blog. I am using an endpoint from the [Report URI](https://report-uri.com/) service (more on this later)

    POST https://rahulpnath.report-uri.com/r/d/csp/reportOnly HTTP/1.1
    {
        "csp-report": {
            "document-uri": "https://www.rahulpnath.com/",
            "referrer": "",
            "violated-directive": "img-src",
            "effective-directive": "img-src",
            "original-policy": "default-src 'none';report-uri https://rahulpnath.report-uri.com/r/d/csp/reportOnly",
            "disposition": "report",
            "blocked-uri": "https://www.rahulpnath.com/apple-touch-icon-120x120.png",
            "line-number": 29,
            "source-file": "https://www.rahulpnath.com/",
            "status-code": 0,
            "script-sample": ""
        }
    }
    

## Generating CSP Policies

Coming up with the CSP policies for your site can be a bit tricky as there are a lot of options and directives involved. Your site might also be pulling in dependencies from a variety of sources. Setting CSP policies is also an excellent time to review your application dependencies and manage them correctly. For e.g., if you have a javascript file from an untrusted source, etc. There are a few ways by which you can go about generating CSP policies. Below are two ways I found useful and easy to get started.

### Using Fiddler

The [CSP Fiddler Extension](https://github.com/david-risney/CSP-Fiddler-Extension) is a Fiddler extension that helps you produce a strong CSP for a web page (or website). Install the extension and with Fiddler running navigate to your web pages using a browser that supports CSP.

> *The extension adds mock Content-Security-Policy-Report-Only headers to servers' responses and uses the report-uri https://fiddlercsp.deletethis.net/unsafe-inline. The extension then listens to the specified report-uri and generates a CSP based on the gathered information*

![Fiddler CSP Rule Collector](__GHOST_URL__/content/images/https_csp_fiddler_rule_collector.png)
### Using Report URI

[ReportURI](https://report-uri.com/) is a real-time security reporting tool which can be used to collect various metrics about your website. One of the features it provides is giving a nice little wizard interface for creating your CSP headers. [Pricing](https://report-uri.com/#prices) is usage based and provides the first 10000 reports of the month free (which is what I am using for this blog).

ReportURI gives a dashboard summarizing the various stats of your site and also provides features to explore these in detail.
![Report Uri Dashboard](__GHOST_URL__/content/images/csp_report_uri_dashboard.png)
One of the cool features is the [CSP Wizard](https://scotthelme.co.uk/report-uri-csp-wizard/) which as the name suggests, provides a wizard-like UI to build out CSP's for the site. The websites need to be configured to report CSP errors to a specific endpoint on your ReportURI endpoint (as shown below). The header value can be set either on CSP header or the Report Only header.

> _You can find your report URL from the Setup tab on Report URI. Make sure you use the URL under the options Report Type: CSP and Report Disposition:

###Wizard

    Content-Security-Policy-Report-Only: default-src 'none';report-uri https://<subdomain>.report-uri.com/r/d/csp/wizard
    

Once all configured and reports start coming in you can use the Wizard to pick and choose what sources you need to whitelist for your website. You might see a lot of unwanted sources and entries in the wizard as it just reflects what is reported to it. You need to filter it out manually and build the list.

Once you have the CSP's set you can check out if your site does the Harlem Shake by pressing F12 and running the below script. Though this is not any sort of test, it is a fun exercise to do.

Copy pasting scripts from unknown source is not at all recommended and is one of the most powerful ways that an attacker can get access to your account. Having a well defined CSP prevents such script attacks as well on your sites. Don't be suprised if your banking site also shakes to the tune of the script below.

*That said do give the below script a try! I did go through the code pasted below and it is not malicious. All it does modify your dom elements and plays a music. The original source is available below but I do not control it and it could have change since the time of writing.*

    // Harlem Shake - F12 on Browser tab and
    // run below script (Check your Volume)
    
    //Source: http://pastebin.com/aJna4paJ
    javascript: (function () {
      function c() {
        var e = document.createElement('link');
        e.setAttribute('type', 'text/css');
        e.setAttribute('rel', 'stylesheet');
        e.setAttribute('href', f);
        e.setAttribute('class', l);
        document.body.appendChild(e);
      }
      function h() {
        var e = document.getElementsByClassName(l);
        for (var t = 0; t < e.length; t++) {
          document.body.removeChild(e[t]);
        }
      }
      function p() {
        var e = document.createElement('div');
        e.setAttribute('class', a);
        document.body.appendChild(e);
        setTimeout(function () {
          document.body.removeChild(e);
        }, 100);
      }
      function d(e) {
        return { height: e.offsetHeight, width: e.offsetWidth };
      }
      function v(i) {
        var s = d(i);
        return s.height > e && s.height < n && s.width > t && s.width < r;
      }
      function m(e) {
        var t = e;
        var n = 0;
        while (!!t) {
          n += t.offsetTop;
          t = t.offsetParent;
        }
        return n;
      }
      function g() {
        var e = document.documentElement;
        if (!!window.innerWidth) {
          return window.innerHeight;
        } else if (e && !isNaN(e.clientHeight)) {
          return e.clientHeight;
        }
        return 0;
      }
      function y() {
        if (window.pageYOffset) {
          return window.pageYOffset;
        }
        return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
      }
      function E(e) {
        var t = m(e);
        return t >= w && t <= b + w;
      }
      function S() {
        var e = document.createElement('audio');
        e.setAttribute('class', l);
        e.src = i;
        e.loop = false;
        e.addEventListener(
          'canplay',
          function () {
            setTimeout(function () {
              x(k);
            }, 500);
            setTimeout(function () {
              N();
              p();
              for (var e = 0; e < O.length; e++) {
                T(O[e]);
              }
            }, 15500);
          },
          true,
        );
        e.addEventListener(
          'ended',
          function () {
            N();
            h();
          },
          true,
        );
        e.innerHTML =
          ' <p>If you are reading this, it is because your browser does not support the audio element. We recommend that you get a new browser.</p> <p>';
        document.body.appendChild(e);
        e.play();
      }
      function x(e) {
        e.className += ' ' + s + ' ' + o;
      }
      function T(e) {
        e.className += ' ' + s + ' ' + u[Math.floor(Math.random() * u.length)];
      }
      function N() {
        var e = document.getElementsByClassName(s);
        var t = new RegExp('\\b' + s + '\\b');
        for (var n = 0; n < e.length; ) {
          e[n].className = e[n].className.replace(t, '');
        }
      }
      var e = 30;
      var t = 30;
      var n = 350;
      var r = 350;
      var i = '//s3.amazonaws.com/moovweb-marketing/playground/harlem-shake.mp3';
      var s = 'mw-harlem_shake_me';
      var o = 'im_first';
      var u = ['im_drunk', 'im_baked', 'im_trippin', 'im_blown'];
      var a = 'mw-strobe_light';
      var f = '//s3.amazonaws.com/moovweb-marketing/playground/harlem-shake-style.css';
      var l = 'mw_added_css';
      var b = g();
      var w = y();
      var C = document.getElementsByTagName('*');
      var k = null;
      for (var L = 0; L < C.length; L++) {
        var A = C[L];
        if (v(A)) {
          if (E(A)) {
            k = A;
            break;
          }
        }
      }
      if (A === null) {
        console.warn('Could not find a node of the right size. Please try a different page.');
        return;
      }
      c();
      S();
      var O = [];
      for (var L = 0; L < C.length; L++) {
        var A = C[L];
        if (v(A)) {
          O.push(A);
        }
      }
    })();
    

I am still playing around with the CSP headers for this blog and currently testing it out using the ReportOnly header along with ReportURI. Hope this helps you to start putting the correct CSP headers for your site as well!
