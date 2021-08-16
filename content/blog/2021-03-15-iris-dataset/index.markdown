---
title: 'Iris dataset'
summary: A quick demostration of Rmarkdown power using blogdown!
date: '2021-03-15'
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

## Session info

<details class="f6 fw7 input-reset">
  <summary>Show/hide</summary>
```
## ─ Session info ───────────────────────────────────────────────────────────────
##  setting  value
##  version  R version 4.0.4 (2021-02-15)
##  os       macOS Big Sur 10.16
##  system   x86_64, darwin17.0
##  ui       X11
##  language (EN)
##  collate  en_US.UTF-8
##  ctype    en_US.UTF-8
##  tz       America/Mexico_City
##  date     2021-03-15
##
## ─ Packages ───────────────────────────────────────────────────────────────────
##  package     * version date       lib source
##  assertthat    0.2.1   2019-03-21 [1] CRAN (R 4.0.2)
##  backports     1.2.1   2020-12-09 [1] CRAN (R 4.0.2)
##  blogdown      1.2.1   2021-03-07 [1] Github (rstudio/blogdown@f324246)
##  bookdown      0.21    2020-10-13 [1] CRAN (R 4.0.2)
##  broom         0.7.5   2021-02-19 [1] CRAN (R 4.0.2)
##  bslib         0.2.4   2021-01-25 [1] CRAN (R 4.0.2)
##  cellranger    1.1.0   2016-07-27 [1] CRAN (R 4.0.2)
##  cli           2.3.1   2021-02-23 [1] CRAN (R 4.0.2)
##  colorspace    2.0-0   2020-11-11 [1] CRAN (R 4.0.2)
##  crayon        1.4.1   2021-02-08 [1] CRAN (R 4.0.2)
##  DBI           1.1.1   2021-01-15 [1] CRAN (R 4.0.2)
##  dbplyr        2.1.0   2021-02-03 [1] CRAN (R 4.0.2)
##  digest        0.6.27  2020-10-24 [1] CRAN (R 4.0.2)
##  dplyr       * 1.0.4   2021-02-02 [1] CRAN (R 4.0.2)
##  ellipsis      0.3.1   2020-05-15 [1] CRAN (R 4.0.2)
##  evaluate      0.14    2019-05-28 [1] CRAN (R 4.0.1)
##  fansi         0.4.2   2021-01-15 [1] CRAN (R 4.0.2)
##  farver        2.1.0   2021-02-28 [1] CRAN (R 4.0.4)
##  forcats     * 0.5.1   2021-01-27 [1] CRAN (R 4.0.2)
##  fs            1.5.0   2020-07-31 [1] CRAN (R 4.0.2)
##  generics      0.1.0   2020-10-31 [1] CRAN (R 4.0.2)
##  ggplot2     * 3.3.3   2020-12-30 [1] CRAN (R 4.0.2)
##  glue          1.4.2   2020-08-27 [1] CRAN (R 4.0.2)
##  gtable        0.3.0   2019-03-25 [1] CRAN (R 4.0.2)
##  haven         2.3.1   2020-06-01 [1] CRAN (R 4.0.1)
##  highr         0.8     2019-03-20 [1] CRAN (R 4.0.2)
##  hms           1.0.0   2021-01-13 [1] CRAN (R 4.0.2)
##  htmltools     0.5.1.1 2021-01-22 [1] CRAN (R 4.0.2)
##  httr          1.4.2   2020-07-20 [1] CRAN (R 4.0.2)
##  janitor     * 2.1.0   2021-01-05 [1] CRAN (R 4.0.2)
##  jquerylib     0.1.3   2020-12-17 [1] CRAN (R 4.0.2)
##  jsonlite      1.7.2   2020-12-09 [1] CRAN (R 4.0.2)
##  knitr         1.31    2021-01-27 [1] CRAN (R 4.0.2)
##  labeling      0.4.2   2020-10-20 [1] CRAN (R 4.0.2)
##  lifecycle     1.0.0   2021-02-15 [1] CRAN (R 4.0.2)
##  lubridate     1.7.10  2021-02-26 [1] CRAN (R 4.0.2)
##  magrittr      2.0.1   2020-11-17 [1] CRAN (R 4.0.2)
##  modelr        0.1.8   2020-05-19 [1] CRAN (R 4.0.1)
##  munsell       0.5.0   2018-06-12 [1] CRAN (R 4.0.2)
##  pillar        1.5.0   2021-02-22 [1] CRAN (R 4.0.2)
##  pkgconfig     2.0.3   2019-09-22 [1] CRAN (R 4.0.2)
##  purrr       * 0.3.4   2020-04-17 [1] CRAN (R 4.0.2)
##  R6            2.5.0   2020-10-28 [1] CRAN (R 4.0.2)
##  Rcpp          1.0.6   2021-01-15 [1] CRAN (R 4.0.2)
##  readr       * 1.4.0   2020-10-05 [1] CRAN (R 4.0.2)
##  readxl        1.3.1   2019-03-13 [1] CRAN (R 4.0.1)
##  reprex        1.0.0   2021-01-27 [1] CRAN (R 4.0.2)
##  rlang         0.4.10  2020-12-30 [1] CRAN (R 4.0.2)
##  rmarkdown     2.7     2021-02-19 [1] CRAN (R 4.0.2)
##  rstudioapi    0.13    2020-11-12 [1] CRAN (R 4.0.2)
##  rvest         0.3.6   2020-07-25 [1] CRAN (R 4.0.2)
##  sass          0.3.1   2021-01-24 [1] CRAN (R 4.0.2)
##  scales        1.1.1   2020-05-11 [1] CRAN (R 4.0.2)
##  sessioninfo   1.1.1   2018-11-05 [1] CRAN (R 4.0.2)
##  snakecase     0.11.0  2019-05-25 [1] CRAN (R 4.0.2)
##  stringi       1.5.3   2020-09-09 [1] CRAN (R 4.0.2)
##  stringr     * 1.4.0   2019-02-10 [1] CRAN (R 4.0.2)
##  tibble      * 3.1.0   2021-02-25 [1] CRAN (R 4.0.2)
##  tidyr       * 1.1.2   2020-08-27 [1] CRAN (R 4.0.2)
##  tidyselect    1.1.0   2020-05-11 [1] CRAN (R 4.0.2)
##  tidyverse   * 1.3.0   2019-11-21 [1] CRAN (R 4.0.2)
##  utf8          1.1.4   2018-05-24 [1] CRAN (R 4.0.2)
##  vctrs         0.3.6   2020-12-17 [1] CRAN (R 4.0.2)
##  withr         2.4.1   2021-01-26 [1] CRAN (R 4.0.2)
##  xfun          0.21    2021-02-10 [1] CRAN (R 4.0.2)
##  xml2          1.3.2   2020-04-23 [1] CRAN (R 4.0.2)
##  yaml          2.2.1   2020-02-01 [1] CRAN (R 4.0.2)
##
## [1] /Library/Frameworks/R.framework/Versions/4.0/Resources/library
```
</details>
