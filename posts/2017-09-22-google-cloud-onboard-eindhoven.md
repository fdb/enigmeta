---
layout: post
tags: post
title: Google Cloud OnBoard Eindhoven
bigshot: bigshot.jpg
---

<style>
.post p img { border: none; box-shadow: none; }
</style>

On Wednesday September 20th I participated in the Google Cloud OnBoard event at the High Tech Campus in Eindhoven.

The event was an introduction in the features of the Google Cloud infrastructure: everything from hosting your own apps, storage and databases to working with big data and machine learning.

The event was organized by Google and presented by [Matthew Feigal](https://twitter.com/mattfgl) from Google and [Mark Crump](https://twitter.com/crumpyscloud) from [QA](https://www.qa.com), a Google training partner.

# Introduction

![Google Cloud Platform](/media/blog/google-cloud-onboard-eindhoven/gcp.png)

The Google Cloud platform is big, but can be broken down in four sections:

- **Compute**: managing the machines that run your applications. Ranging from Compute Engine, which is a VPS, to App Engine, which is a Platform as a Service (PaaS).
- **Storage**: managing how you store and access data. This covers file storage (Cloud Storage), Cloud SQL and Bigtable for big projects.
- **Big Data**: asking questions about large datasets. Use BigQuery to perform SQL-like queries on terabyte-size datasets, Pub/Sub for messaging, Datalab for an IPython Notebook in the cloud.
- **Machine Learning**: access to Google's infrastructure for your own machine learning jobs using TensorFlow, or pre-built machine learning apps like Cloud Vision, the Natural Language API or the Speech API.

Monitoring all of that data happens through [StackDriver](https://cloud.google.com/stackdriver/), an application to monitor, log and debug applications.

## Infrastructure

- Google's physical network is impressive. They essentially built their own internet, including undersea cables and dark fiber, so that once you get on the Google network everything is super-fast.
- The primary Europe data center (europe-west1) is located in Belgium, at [St. Ghislain](https://www.google.com/about/datacenters/inside/locations/st-ghislain/).
- You can [ping the Google data centers](http://www.gcping.com/) to get an idea for latency.
- For large customers, they offer to [peer](https://peering.google.com/#/infrastructure) so you can connect directly to their network. In Amsterdam, you can use [Equinix](http://www.equinix.com/) to peer.
- [360° video tour of the Google Data Center](https://www.youtube.com/watch?v=zDAYZU4A3w0). Spot the security guard in every shot.
- There is a [book about how Google runs production systems](https://landing.google.com/sre/).

## Projects and Access

- Everything in Google Cloud Platform is managed by [**project**](https://cloud.google.com/storage/docs/projects). A project contains all infrastructure you want to set up: server, storage, logging, ... . It also unifies billing. A project has a visible name and an internal ID that needs to be globally unique.
- You can use [IAM (Identity and Access Management)](https://cloud.google.com/iam/) to control who has access to what. This can be really granular.

## Privacy / GDPR

- Google [complies with available ISO and HIPAA standards](https://cloud.google.com/security/compliance).
- Google intends to fully comply with the [European General Data Protection Regulation (GDPR)](http://www.eugdpr.org), once they become available.
- You can choose in which [region](https://cloud.google.com/compute/docs/regions-zones/regions-zones) your data is stored (North America, South America, Europe, Asia, Australia).
- All data is encrypted at rest. If you don't trust Google, you can also provide your own custom encryption keys.

## Interacting with Google Cloud Platform

You can access GCP (Google Cloud Platform) using different methods:

- [**Cloud Console**](https://console.cloud.google.com/): a web interface to Google Cloud.
- [**Cloud SDK**](https://cloud.google.com/sdk/): terminal-based tools for accessing services and deploying apps.
- [**Cloud Shell**](https://cloud.google.com/shell/): from the web interface, you get free access to a Linux machine that contains all tools pre-installed. Super-useful.
- [**REST-based APIs**](https://cloud.google.com/apis/docs/overview): so you can create services on-demand. Use [API Explorer](https://developers.google.com/apis-explorer/#p/) to get an overview and try out all accessible APIs. Libraries are available for Java, Python, JavaScript, PHP, .NET, Go, Node.js, Ruby, Objective-C, Dart.
- [**Mobile App**](https://cloud.google.com/console-app/): for managing services from iOS or Android.

# Compute

## [App Engine](https://cloud.google.com/appengine/)

- Easiest way to build an application that doesn't require maintenance and works online.
- Similar to [Heroku](https://www.heroku.com/).
- Two types of environments:
  - **Standard**: autoscaling, free daily quota, limited language support (Java, Python, Go). Has some restrictions to enable scaling: no writing to local file system, for example. Automatic shutdown if the app is not used, saving cost.
  - **Flex**: works with containers, which you can inspect and log in to. Supports every possible language.
- Provides extra services like cron jobs, task queues for rendering or batch processing, search, logs.
- Example: [Crowdsite](https://www.crowdsite.com/), dutch marketplace for design & creatives.

## [Compute Engine](https://cloud.google.com/compute/)

- VPS, like [Linode](https://www.linode.com/) or [Digital Ocean](https://www.digitalocean.com/).
- Different variants: high CPU, high memory, even GPU machines.
- Running a single 512MB server is free!
- Fast to spin up, per-minute billing.
- Use load balancer to distribute load between multiple machines.
- Supports [live migration](https://cloud.google.com/compute/docs/instances/live-migration), so the server keeps running as it is migrated to a different host.
- You can [set and access metadata](https://cloud.google.com/compute/docs/storing-retrieving-metadata) for bootstrapping a server. The server has access to `http://metadata.google.internal/`.

## [Container Engine](https://cloud.google.com/container-engine/)

Used for virtualization at the operating system layer. Separates operating system from _application code and dependencies_.

Containers are used _everywhere_ in Google. Any application runs in a container: Search, Mail, Maps, ... It's the best way to keep dependencies of different applications from messing with each other.

Consistent environment for development, testing, and production. Simple to migrate and move around.

[Docker](https://www.docker.com) and [rkt](https://coreos.com/rkt/) are the most popular container implementations.

### Kubernetes

If you have multiple containers, you might want to orchestrate (manage) them. You can use [Kubernetes](https://kubernetes.io/) for that. It automates deployment and scaling.

Kubernetes specifies a configuration file that contains the requirements of your app: project folder, RAM, disk, CPU and how many replicas you want to have running. The system then makes sure you have that many containers always available. In Google this system is called **Borg**.

Containers lie between directly using a VPS, and the Platform-as-a-Service. You can run everything you want, but Google manages scaling and failover.

Example: [Philips Hue](https://cloud.google.com/customers/philips/) uses containers for scaling the infrastructure controlling the lights in your home. They use [Apigee Edge](http://docs.apigee.com/api-services/content/what-apigee-edge) for managing access to their API, and [Redis](https://redis.io) for storage.

[Container Engine](https://cloud.google.com/container-engine/) is the hosted version of Kubernetes, running on Google Cloud Platform.

## [Cloud Functions](https://cloud.google.com/functions/)

- Run a single function in the cloud, using JavaScript.
- No servers to manage, billing in 100ms intervals.
- Functions that respond to events (e.g. subscribe button, IoT event).
- Works with [Firebase](https://firebase.google.com).
- Perfect for microservices.

## [Cloud Networking](https://cloud.google.com/products/networking/)

- Once you have many systems, you can connect them in a virtual network (VPC). You can set this up using custom routing, DNS, load balancing.
- All nodes in the network (e.g. `192.168.20.0/24`) can be in different regions of the world.
- Google also provides [Cloud CDN](https://cloud.google.com/cdn/), a content delivery network.
- [Google Domains](https://domains.google/) is a domain name registrar for buying and managing domain names. Not available in Belgium / The Netherlands yet.

## [Cloud Endpoints](https://cloud.google.com/endpoints/)

- Proxy for your APIs.
- Supports access control, caching, monitoring.

## [Cloud Deployment Manager](https://cloud.google.com/deployment-manager/)

- Create templates to deploy your resources in a repeatable manner.
- Like [Puppet](https://puppet.com) or [Chef](https://www.chef.io/chef/).

# Storage

## [Cloud Storage](https://cloud.google.com/storage/)

- Like Amazon S3, but cheaper. Similar structure: files are stored in Buckets.
- Access the data from the command line using `gsutil` or through the web interface. You can also transfer data from S3 directly into Cloud Storage.
- You can choose where the data is located: Europe, Asia, America, or multi-regional.
- Supports "nearline" and "coldline", for archival data that is infrequently accessed. Much cheaper, but more expensive to access. Unlike Amazon Glacier, access to the nearline and coldline data is immediate.
- Often used as a first step to store data that can be processed by machine learning jobs, for example tables for BigQuery or images for Cloud Vision.
- Can also serve HTTP/HTTPS traffic. If you have a static site, this might be all you need.
- Good for storing images, media files, backups.

## [Cloud Datastore](https://cloud.google.com/datastore/)

- NoSQL database supporting billions of rows.
- Schemaless access.
- View and edit the data in the web console interface.
- Useful for simple applications but you often need some sort of schema for more complex operations.
- Good for product catalogs, user profiles.
- [Tutorial application with App Engine and Cloud Datastore](https://codelabs.developers.google.com/codelabs/cp100-app-engine/)

## [Cloud Bigtable](https://cloud.google.com/bigtable/)

- Wide-column NoSQL store for terabyte to petabyte-scale applications.
- Used in Gmail, Google Analytics.
- Similar to Cassandra. Accessed using the HBase API (Hadoop).
- Good for "flat data": time series, AdTech, financial data, IoT sensor data, computer logs.

## [Cloud SQL](https://cloud.google.com/sql/)

- Managed MySQL and PostgreSQL database as a service.
- Automatic replication, backups, scaling.
- Easy to integrate with App Engine or Compute Engine instances.
- Good for typical SQL workloads: relational data, customer orders.

### [Cloud Spanner](https://cloud.google.com/spanner/)

- Horizontally-scalable, strongly consistent relational database.
- Based on the [Spanner paper](https://research.google.com/archive/spanner.html).
- Global consistency: very hard to do! Uses atomic clocks in all servers.
- Good for large-scale database applications (> 2 TB).
- Used in GMail for storing metadata.

## [Cloud Source Repositories](https://cloud.google.com/source-repositories/)

- Managed private Git hosting, like GitHub enterprise.
- Can mirror other Git repositories, like from GitHub for example.
- Supports webhooks so that actions happen when a commit is pushed.

## [StackDriver](https://cloud.google.com/stackdriver/)

- Used for monitoring, logging, debugging, error reporting on your infrastructure.
- Nice visualizations.

# Big Data and Machine Learning

Running big data operations on Google Cloud means you just need to focus on the application. You don't have to manage servers or acquire costly GPUs.

## [Cloud BigQuery](https://cloud.google.com/bigquery/)

An analytics database that provides near real-time interactive analysis of massive datasets (hundreds of TBs).

- You throw your data at it (CSV, JSON, realtime streams), write a SQL query, and get a result back.
- Based on the [Dremel paper](https://research.google.com/pubs/pub36632.html).
- During the presentation, we saw queries on the full Wikipedia data set (100 billion rows) in a few seconds.
- Can query custom datasets, or [public datasets](https://cloud.google.com/bigquery/public-data/) such as GitHub, Open Images, World Bank.
- Good for medical data, analytics, ...

## [Cloud Pub/Sub](https://cloud.google.com/pubsub/)

- Managed messaging queue, like [RabbitMQ](http://www.rabbitmq.com) or [Kafka](https://kafka.apache.org).
- Includes support for offline consumers.
- Good for Internet of Things (IoT), marketing analytics, connecting different parts of your application.

## [Cloud Dataflow](https://cloud.google.com/dataflow/)

- Create data pipelines for ETL and run them on a scalable, managed infrastructure.
- A managed installation of [Apache Beam](https://beam.apache.org/)
- Integrates with all other cloud services. BigQuery, Cloud Storage, Pub/Sub.
- Write dataflows in Java and Python.
- Example use case: find the top watched videos at the moment, in 5 minute windows.

## [Cloud Dataproc](https://cloud.google.com/dataproc/)

- Managed Hadoop
- Fast to create your own clusters (90 seconds).
- Good for analyzing large data sets (e.g. logging data) stored in Cloud Storage.

## [Cloud Datalab](https://cloud.google.com/datalab/)

- [Jupyter](http://jupyter.org) (IPython notebook) in the cloud.
- Run and manage data tasks and machine learning in a cloud environment, with fast access to Cloud Storage, machine learning APIs, etc.
- Free (but you pay the costs of accessing other cloud services).

## [Cloud Dataprep](https://cloud.google.com/dataprep/)

- Service for exploring, visualizing and cleaning up your data.
- Similar to Google Refine / [OpenRefine](http://openrefine.org), but running in the cloud.

## [Machine Learning](https://cloud.google.com/products/machine-learning/)

Google open-source [TensorFlow](https://www.tensorflow.org), a widely-used tool for machine learning. They now provide tools to run TensorFlow jobs in the cloud, as well as pre-trained models for computer vision, language analysis and translation, and text-to-speech.

[Rokesh Jankie](https://twitter.com/rjankie), a Google engineer, gave the best one-line introduction to AI I've ever heard: "You create a function, only we don't know yet the formula of the function." Instead of linear functions, we use neural networks, which can handle complex transformations and noise better. He demonstrated this using the [TensorFlow Playground](http://playground.tensorflow.org/). He also showed the [Cloud Vision Explorer](http://vision-explorer.reactive.ai/), showing an interactive demonstration of the capabilities of the Cloud Vision API. He also showed [WaveNet](https://deepmind.com/blog/wavenet-generative-model-raw-audio/), a generative model for the generation of text-to-speech. He demonstrated how computer vision can be used to find disease patterns in images of eyes.

A few use cases:

- **Classification / Regression**: forecasting, customer churn analysis ("why are my customers leaving?")
- **Recommendations**: content personalization
- **Anomaly detection**: detect fraud, log anomalies in metrics or sensors
- **Image analytics**: identify damaged shipments, detect explicit (adult/violent) images.
- **Text analytics**: call center log analysis, language identification, sentiment extraction.

### [Cloud Machine Learning Engine](https://cloud.google.com/ml-engine/)

- For custom machine learning jobs.
- Google provides infrastructure for training your model.
- Once trained, your model can run on user's computer or smartphones.

### [Cloud Vision API](https://cloud.google.com/vision/)

- Analyze images with a REST api.
- Supports face detection, label detection, sentiment analysis, text extraction (OCR).
- Returns bounding boxes of faces (and facial features), objects in JSON.
- [COCO](http://cocodataset.org/) is an image dataset that has labelled and segmented images for use in image recognition. It is available under a [Creative Commons license](http://cocodataset.org/#termsofuse).

### [Cloud Speech API](https://cloud.google.com/speech/)

- Recognizes over 80 languages.
- Can return text in real-time (streaming).

### [Cloud Natural Language API](https://cloud.google.com/natural-language/)

- Extract information about people, places, events mentioned in text: news articles, papers, blog posts.
- Sentiment extraction.
- Can be used for Chatbots.
- Ocado, an online grocery store in the UK, used it to triage customer requests into urgent delivery-related messages and other messages.
- Dealing with sarcasm is still difficult. You can tune the parameters of the network.

### [Cloud Translation API](https://cloud.google.com/translate/)

- Translate strings between different languages.
- Detect language of input text.

### AutoML

- Selecting machine learning architectures is a difficult and time-consuming task.
- [AutoML](https://sites.google.com/site/automl2017icml/) is an area of research that tries to automate this process, by having machine learning algorithms figure out the best machine learning algorithms.
- One way to do this is to have neural networks compete with each other.

# Next Steps

## Learning Resources

- [Official Google Cloud Platform documentation site](https://cloud.google.com/docs/).
- [GitHub page with tutorials](http://googlecloudplatform.github.io).
- [Qwiklabs: self-paced training labs](https://qwiklabs.com).
- Google also offers [training and certification](https://cloud.google.com/training/).

## Community

- In the Netherlands there is the [Google Developers Group](https://www.gdgnetherlands.org). There is also a [Meetup Group](https://www.meetup.com/Google-Developer-Group-Netherlands/).
- In Belgium there is the [Brussels GDG](http://gdg.brussels/).

![High Tech Campus Eindhoven](/media/blog/google-cloud-onboard-eindhoven/outro.jpg)
