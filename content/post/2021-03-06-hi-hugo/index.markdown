---
title: "Hi Hugo"
author: "Jesús Vélez"
date: '2021-03-06'
slug: hi-hugo
categories: ["R"]
tags: ["R"]
subtitle: ''
summary: ''
authors: ["Jesús Vélez"]
lastmod: '2021-03-06T20:34:32-06:00'
featured: no
image:
  caption: ''
  focal_point: ''
  preview_only: no
projects: []
---



## Load libraries


```r
library(ggplot2)
```

## Data summary


```r
summary(Orange)
##  Tree       age         circumference  
##  3:7   Min.   : 118.0   Min.   : 30.0  
##  1:7   1st Qu.: 484.0   1st Qu.: 65.5  
##  5:7   Median :1004.0   Median :115.0  
##  2:7   Mean   : 922.1   Mean   :115.9  
##  4:7   3rd Qu.:1372.0   3rd Qu.:161.5  
##        Max.   :1582.0   Max.   :214.0
```

## Visualize data

<img src="{{< blogdown/postref >}}index_files/figure-html/unnamed-chunk-3-1.png" width="672" />

