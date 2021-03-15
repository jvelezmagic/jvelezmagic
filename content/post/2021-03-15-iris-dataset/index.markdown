---
title: 'Iris dataset'
author: Jesús Vélez
date: '2021-03-15'
slug: iris-dataset
categories: ["R"]
tags: ["R"]
subtitle: ''
summary: ''
authors: []
lastmod: '2021-03-15T14:08:18-06:00'
featured: no
image:
  caption: ''
  focal_point: ''
  preview_only: no
projects: []
---

> "If you’ve ever had any statistics or machine learning training, formally or informally, you can’t be unfamiliar with the Iris dataset, which even has its own Wikipedia page given its popularity."

## Load libraries


```r
library(tidyverse)
library(janitor)
```

## Iris dataset


```r
iris %>% 
    glimpse()
```

```
## Rows: 150
## Columns: 5
## $ Sepal.Length <dbl> 5.1, 4.9, 4.7, 4.6, 5.0, 5.4, 4.6, 5.0, 4.4, 4.9, 5.4, 4.…
## $ Sepal.Width  <dbl> 3.5, 3.0, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.…
## $ Petal.Length <dbl> 1.4, 1.4, 1.3, 1.5, 1.4, 1.7, 1.4, 1.5, 1.4, 1.5, 1.5, 1.…
## $ Petal.Width  <dbl> 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.…
## $ Species      <fct> setosa, setosa, setosa, setosa, setosa, setosa, setosa, s…
```

## Clean and transform to tidy format


```r
iris_clean <- iris %>% 
    clean_names() %>% 
    pivot_longer(
        cols = -species,
        names_to = "measurement",
        values_to = "value"
    ) %>% 
    mutate(
        species = str_to_sentence(species),
        measurement = str_replace(measurement, "_", " ") %>% 
            str_to_sentence()
    ) %>% 
    glimpse()
```

```
## Rows: 600
## Columns: 3
## $ species     <chr> "Setosa", "Setosa", "Setosa", "Setosa", "Setosa", "Setosa"…
## $ measurement <chr> "Sepal length", "Sepal width", "Petal length", "Petal widt…
## $ value       <dbl> 5.1, 3.5, 1.4, 0.2, 4.9, 3.0, 1.4, 0.2, 4.7, 3.2, 1.3, 0.2…
```

## Visualization

### Set plot defaults


```r
theme_set(theme_bw())
```

### Density of measurements by species


```r
iris_clean %>% 
    ggplot(aes(x=value, color=species, fill=species)) +
    geom_density(alpha=1/5) +
    facet_grid(
        measurement~species,
        scales = "free_y"
    ) +
    labs(
        x = "Value",
        y = "Density",
        title = "Density of measurements by species",
        color = "Species",
        fill = "Species"
    )
```

<img src="{{< blogdown/postref >}}index_files/figure-html/scatter-1.png" width="672" />


