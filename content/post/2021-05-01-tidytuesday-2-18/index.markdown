---
title: "Using Highcharter in #TidyTuesday CEOs departures"
author: Jesús Vélez
date: '2021-05-01'
slug: tidytuesday-2-18
categories: ["R", "TidyTuesday", "dataviz"]
tags: []
subtitle: 'Season 2 - Week 18'
summary: 'Tidytuesday - 2 - 18 - The data this week comes from Gentry et al. by way of DataIsPlural. Learn how to use Highcharter, a wrapper for Highcharts javascript library and its modules.'
authors: []
lastmod: '2021-05-01T16:48:00-05:00'
featured: no
image:
  caption: 'Image of blurred moving people walking through an office lobby'
  focal_point: ''
  preview_only: no
projects: []
links:
- icon: github
  icon_pack: fab
  name: Code
  url: https://github.com/jvelezmagic/jvelezmagic/blob/main/content/post/2021-05-01-tidytuesday-2-18/index.Rmarkdown
- icon: twitter
  icon_pack: fab
  name: Post
  url: https://twitter.com/jvelezmagic
---

<script src="{{< blogdown/postref >}}index_files/htmlwidgets/htmlwidgets.js"></script>
<script src="{{< blogdown/postref >}}index_files/pymjs/pym.v1.js"></script>
<script src="{{< blogdown/postref >}}index_files/widgetframe-binding/widgetframe.js"></script>
<script src="{{< blogdown/postref >}}index_files/htmlwidgets/htmlwidgets.js"></script>
<script src="{{< blogdown/postref >}}index_files/pymjs/pym.v1.js"></script>
<script src="{{< blogdown/postref >}}index_files/widgetframe-binding/widgetframe.js"></script>
<script src="{{< blogdown/postref >}}index_files/htmlwidgets/htmlwidgets.js"></script>
<script src="{{< blogdown/postref >}}index_files/pymjs/pym.v1.js"></script>
<script src="{{< blogdown/postref >}}index_files/widgetframe-binding/widgetframe.js"></script>

## CEO departures

The data this week comes from [Gentry et al.](https://onlinelibrary.wiley.com/doi/abs/10.1002/smj.3278) by way of [DataIsPlural](https://www.data-is-plural.com/archive/2021-04-21-edition/).

> We introduce an open‐source dataset documenting the reasons for CEO departure in S&P 1500 firms from 2000 through 2018. In our dataset, we code for various forms of voluntary and involuntary departure. We compare our dataset to three published datasets in the CEO succession literature to assess both the qualitative and quantitative differences among them and to explore how these differences impact empirical findings associated with the performance‐CEO dismissal relationship. The dataset includes eight different classifications for CEO turnover, a narrative description of each departure event, and links to sources used in constructing the narrative so that future researchers can validate or adapt the coding. The resulting data are available at (https://doi.org/10.5281/zenodo.4543893).
>
> This revision includes potentially relevant 8k filings from 270 days before and after the CEO’s departure date. These filings were not all useful for understanding the departure, but might be useful in general.

Another article from [investors.com](https://www.investors.com/news/ceo-turnover-bailing-out-droves/).

## Libraries

``` r
library(tidyverse)
library(tidytext)
library(tidytuesdayR)
library(stopwords)
library(widgetframe)
library(highcharter)
```

## Download data

``` r
tuesday_data <- tt_load(x = 2021, week = 18)
```

## Extract data to use

``` r
departures <- tuesday_data$departures %>% 
  glimpse()
```

    ## Rows: 9,423
    ## Columns: 19
    ## $ dismissal_dataset_id <dbl> 559043, 12, 13, 31, 43, 51, 61, 63, 62, 65, 75, 7…
    ## $ coname               <chr> "SONICBLUE INC", "AMERICAN AIRLINES GROUP INC", "…
    ## $ gvkey                <dbl> 27903, 1045, 1045, 1078, 1161, 1177, 1194, 1194, …
    ## $ fyear                <dbl> 2002, 1997, 2002, 1998, 2001, 1997, 1993, 1997, 1…
    ## $ co_per_rol           <dbl> -1, 1, 3, 6, 11, 16, 21, 22, 24, 28, 33, 34, 38, …
    ## $ exec_fullname        <chr> "L. Gregory Ballard", "Robert L. Crandall", "Dona…
    ## $ departure_code       <dbl> 7, 5, 3, 5, 5, 5, 5, 7, 9, 5, 5, 5, 3, 5, 5, 3, 3…
    ## $ ceo_dismissal        <dbl> 0, 0, 1, 0, 0, 0, 0, 0, NA, 0, 0, 0, 1, 0, 0, 1, …
    ## $ interim_coceo        <chr> NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, N…
    ## $ tenure_no_ceodb      <dbl> 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1…
    ## $ max_tenure_ceodb     <dbl> 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1…
    ## $ fyear_gone           <dbl> 2003, 1998, 2003, 1998, 2002, 1997, 1993, 1998, 1…
    ## $ leftofc              <dttm> 2003-03-21, 1998-05-20, 2003-04-24, 1998-12-31, …
    ## $ still_there          <chr> NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, N…
    ## $ notes                <chr> "Ballard took over when the outgoing CEO said tha…
    ## $ sources              <chr> "https://www.wsj.com/articles/SB10288576921909334…
    ## $ eight_ks             <chr> "https://www.sec.gov/Archives/edgar/data/850519/0…
    ## $ cik                  <dbl> 850519, 6201, 6201, 1800, 2488, 1122304, 771667, …
    ## $ `_merge`             <chr> "matched (3)", "matched (3)", "matched (3)", "mat…

## General preprocessing

``` r
departures_processed <- departures %>%
  select(fyear, departure_code, notes) %>%
  filter(
      departure_code < 9,
      fyear > 1995,
      fyear < 2019
  ) %>%
  mutate(
      involuntary = if_else(
        condition = departure_code %in% 3:4,
        true = "Involuntary",
        false = "Other"
      ),
      departure_code = fct_recode(
        .f = factor(departure_code),
          "Death" = "1",
          "Illness" = "2",
          "Job performance" = "3",
          "Legal violations or concerns" = "4",
          "Retired" = "5",
          "New opportunity" = "6",
          "Other" = "7",
          "Missing" = "8"
      )
  ) %>%
  glimpse()
```

    ## Rows: 6,942
    ## Columns: 4
    ## $ fyear          <dbl> 2002, 1997, 2002, 1998, 2001, 1997, 1997, 2000, 2007, 2…
    ## $ departure_code <fct> Other, Retired, Job performance, Retired, Retired, Reti…
    ## $ notes          <chr> "Ballard took over when the outgoing CEO said that the …
    ## $ involuntary    <chr> "Other", "Other", "Involuntary", "Other", "Other", "Oth…

## Create custom credits for plots

``` r
add_custom_credits <- partial(
  hc_credits,
  text = "<b>Dataviz by:</b> @jvelezmagic",
  href = "https://twitter.com/jvelezmagic",
  enabled = TRUE
)
```

## CEOs departures

### Prepare data for plot

``` r
involuntary_departures <- departures_processed %>%
  count(fyear, involuntary) %>% 
  glimpse()
```

    ## Rows: 46
    ## Columns: 3
    ## $ fyear       <dbl> 1996, 1996, 1997, 1997, 1998, 1998, 1999, 1999, 2000, 2000…
    ## $ involuntary <chr> "Involuntary", "Other", "Involuntary", "Other", "Involunta…
    ## $ n           <int> 42, 273, 52, 274, 42, 305, 58, 332, 78, 286, 64, 165, 73, …

### Create interactive line plot

``` r
involuntary_departures %>%
  # Plot specifications -----------------------------------------------------
  hchart(
    type = "line",
    hcaes(x = fyear, y = n, group = involuntary)
  ) %>%
  hc_tooltip(
    crosshairs = TRUE,
    shared = TRUE
  ) %>% 
  # Text annotations --------------------------------------------------------
  hc_title(
    text = "CEOs departures"
  ) %>%
  hc_xAxis(
    title = list(text = "Year"),
    plotBands = list(
      list(
        label = list(
          text = "Global<br>crisis",
          style = list(
            color = "white",
            fontWeight = "bold"
          ),
          useHTML = TRUE
        ),
        color = "rgba(256,0,0,0.4)",
        fillOpacity = 0.5,
        from = 2006,
        to = 2008
      )
    )
  ) %>%
  hc_yAxis(
    title = list(text = "Number of CEOs departures")
  ) %>%
  # Credits -----------------------------------------------------------------
  add_custom_credits() %>%
  # Display as iframe -------------------------------------------------------
  frameWidget()
```

<div id="htmlwidget-1" style="width:100%;height:480px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-1">{"x":{"url":"index_files/figure-html//widgets/widget_line_plot.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>

## Historical CEOs departures by category

### Prepare data for plot

``` r
departures_treemap_plot <- departures_processed %>%
  mutate(
    fyear = as.character(fyear),
    value = 1
  ) %>%
  data_to_hierarchical(
    group_vars = c(departure_code, fyear),
    size_var = value
  )

departures_treemap_plot[[1]] %>% 
  glimpse()
```

    ## List of 4
    ##  $ name : chr "Retired"
    ##  $ id   : chr "retired"
    ##  $ color: chr "#7cb5ec"
    ##  $ level: int 1

### Create nested treemap

``` r
# Plot specification --------------------------------------------------------
hchart(
  departures_treemap_plot,
  type = "treemap",
  ## Global configuration ---------------------------------------------------
  dataLabels = list(
    enabled = FALSE
  ),
  ## Modify levels appearance -----------------------------------------------
  allowDrillToNode = TRUE,
  levelIsConstant = FALSE,
  levels = list(
    list(
      level = 1,
      borderWidth = 4,
      dataLabels = list(
        enabled = TRUE,
        style = list(
          fontSize = "14px"
        )
      )
    ),
    list(
      level = 2,
      dataLabels = list(
        enabled = FALSE
      ),
      colorVariation = list(
        key = "brightness",
        to = 0.25
      )
    )
  )
) %>%
  # Text annotations --------------------------------------------------------
  hc_title(
    text = "CEOs departures by category"
  ) %>%
  # Credits -----------------------------------------------------------------
  add_custom_credits() %>%
  # Display as iframe -------------------------------------------------------
  frameWidget()
```

<div id="htmlwidget-2" style="width:100%;height:480px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-2">{"x":{"url":"index_files/figure-html//widgets/widget_treemap.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>

## Why CEOs leave the company?

### Text processing

``` r
departures_words <- departures_processed %>%
  select(departure_code, notes) %>%
  unnest_tokens(output = word, input = notes) %>%
  anti_join(y = get_stopwords()) %>%
  inner_join(y = get_sentiments(lexicon = "bing")) %>%
  count(departure_code, word) %>%
  glimpse()
```

    ## Rows: 2,599
    ## Columns: 3
    ## $ departure_code <fct> Death, Death, Death, Death, Death, Death, Death, Death,…
    ## $ word           <chr> "absence", "affluence", "attack", "best", "cancer", "ce…
    ## $ n              <int> 1, 1, 6, 1, 11, 1, 2, 3, 1, 8, 1, 51, 1, 1, 2, 1, 1, 1,…

### Prepare data for plot

``` r
departures_words_plot <- departures_words %>%
  group_nest(departure_code) %>%
  mutate(
    id = departure_code,
    type = "wordcloud",
    data = map(data, mutate, name = word, weight = log(n)),
    data = map(data, list_parse),
    n = lengths(data)
  ) %>%
  glimpse()
```

    ## Rows: 8
    ## Columns: 5
    ## $ departure_code <fct> Death, Illness, Job performance, Legal violations or co…
    ## $ data           <list> [["absence", 1, "absence", 0], ["affluence", 1, "afflu…
    ## $ id             <fct> Death, Illness, Job performance, Legal violations or co…
    ## $ type           <chr> "wordcloud", "wordcloud", "wordcloud", "wordcloud", "wo…
    ## $ n              <int> 54, 94, 790, 263, 686, 76, 602, 34

### Create interactive Word Cloud

``` r
departures_words_plot %>%
  # Plot specification ------------------------------------------------------
  ## First level ------------------------------------------------------------
  hchart(
    type = "wordcloud",
    name = "Categories",
    hcaes(
      name = departure_code,
      weight = log(n),
      drilldown = departure_code
    )
  ) %>%
  ## Second level -----------------------------------------------------------
  hc_drilldown(
    allowPointDrilldown = TRUE,
    series = list_parse(departures_words_plot)
  ) %>%
  # Text annotations --------------------------------------------------------
  ## Main title -------------------------------------------------------------
  hc_title(
    text = "CEOs, You are fired! But wait ... why?"
  ) %>% 
  ## Insert and remove title when drilldown ---------------------------------
  hc_chart(
    type = "column",
    events = list(
      drilldown = JS("
        function(e) {
          this.update(
            {
              title: {
                text: e.seriesOptions.id
              }
            }
          )
        }
      "
      ),
      drillup = JS("
        function() {
          this.update(
            {
              title: {
                text: 'CEOs, You are fired! But wait ... why?' 
              }
            }
          )
        }
      "
      )
    )
  ) %>%
  ## Configure how tooltip is displayed -------------------------------------
  hc_tooltip(
    pointFormat = tooltip_table(
      x = c("Word count:  "),
      y = c("{point.n}")
    ),
    useHTML = TRUE
  ) %>%
  # Credits ---------------------------------------------------------------
  add_custom_credits() %>%
  # Display as iframe -----------------------------------------------------
  frameWidget()
```

<div id="htmlwidget-3" style="width:100%;height:480px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-3">{"x":{"url":"index_files/figure-html//widgets/widget_wordcloud.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>

## Session info

    ## ─ Session info ───────────────────────────────────────────────────────────────
    ##  setting  value                       
    ##  version  R version 4.0.5 (2021-03-31)
    ##  os       macOS Big Sur 10.16         
    ##  system   x86_64, darwin17.0          
    ##  ui       X11                         
    ##  language (EN)                        
    ##  collate  en_US.UTF-8                 
    ##  ctype    en_US.UTF-8                 
    ##  tz       America/Mexico_City         
    ##  date     2021-05-01                  
    ## 
    ## ─ Packages ───────────────────────────────────────────────────────────────────
    ##  ! package      * version date       lib source        
    ##  P assertthat     0.2.1   2019-03-21 [?] CRAN (R 4.0.2)
    ##  P backports      1.2.1   2020-12-09 [?] CRAN (R 4.0.2)
    ##  P blogdown       1.3     2021-04-14 [?] CRAN (R 4.0.2)
    ##  P bookdown       0.22    2021-04-22 [?] CRAN (R 4.0.2)
    ##  P broom          0.7.6   2021-04-05 [?] CRAN (R 4.0.2)
    ##  P bslib          0.2.4   2021-01-25 [?] CRAN (R 4.0.2)
    ##  P cellranger     1.1.0   2016-07-27 [?] CRAN (R 4.0.2)
    ##  P cli            2.5.0   2021-04-26 [?] CRAN (R 4.0.2)
    ##  P colorspace     2.0-0   2020-11-11 [?] CRAN (R 4.0.2)
    ##  P crayon         1.4.1   2021-02-08 [?] CRAN (R 4.0.2)
    ##  P curl           4.3.1   2021-04-30 [?] CRAN (R 4.0.5)
    ##  P data.table     1.14.0  2021-02-21 [?] CRAN (R 4.0.2)
    ##  P DBI            1.1.1   2021-01-15 [?] CRAN (R 4.0.2)
    ##  P dbplyr         2.1.1   2021-04-06 [?] CRAN (R 4.0.2)
    ##  P digest         0.6.27  2020-10-24 [?] CRAN (R 4.0.2)
    ##  P dplyr        * 1.0.5   2021-03-05 [?] CRAN (R 4.0.2)
    ##  P ellipsis       0.3.2   2021-04-29 [?] CRAN (R 4.0.5)
    ##  P evaluate       0.14    2019-05-28 [?] CRAN (R 4.0.1)
    ##  P fansi          0.4.2   2021-01-15 [?] CRAN (R 4.0.2)
    ##  P forcats      * 0.5.1   2021-01-27 [?] CRAN (R 4.0.2)
    ##  P fs             1.5.0   2020-07-31 [?] CRAN (R 4.0.2)
    ##  P generics       0.1.0   2020-10-31 [?] CRAN (R 4.0.2)
    ##  P ggplot2      * 3.3.3   2020-12-30 [?] CRAN (R 4.0.2)
    ##  P glue           1.4.2   2020-08-27 [?] CRAN (R 4.0.2)
    ##  P gtable         0.3.0   2019-03-25 [?] CRAN (R 4.0.2)
    ##  P haven          2.4.1   2021-04-23 [?] CRAN (R 4.0.2)
    ##  P highcharter  * 0.8.2   2020-07-26 [?] CRAN (R 4.0.2)
    ##  P hms            1.0.0   2021-01-13 [?] CRAN (R 4.0.2)
    ##  P htmltools      0.5.1.1 2021-01-22 [?] CRAN (R 4.0.2)
    ##  P htmlwidgets  * 1.5.3   2020-12-10 [?] CRAN (R 4.0.2)
    ##  P httr           1.4.2   2020-07-20 [?] CRAN (R 4.0.2)
    ##  P igraph         1.2.6   2020-10-06 [?] CRAN (R 4.0.2)
    ##  P janeaustenr    0.1.5   2017-06-10 [?] CRAN (R 4.0.2)
    ##  P jquerylib      0.1.4   2021-04-26 [?] CRAN (R 4.0.2)
    ##  P jsonlite       1.7.2   2020-12-09 [?] CRAN (R 4.0.2)
    ##  P knitr          1.33    2021-04-24 [?] CRAN (R 4.0.2)
    ##  P lattice        0.20-41 2020-04-02 [?] CRAN (R 4.0.5)
    ##  P lifecycle      1.0.0   2021-02-15 [?] CRAN (R 4.0.2)
    ##  P lubridate      1.7.10  2021-02-26 [?] CRAN (R 4.0.2)
    ##  P magrittr       2.0.1   2020-11-17 [?] CRAN (R 4.0.2)
    ##  P Matrix         1.3-2   2021-01-06 [?] CRAN (R 4.0.5)
    ##  P modelr         0.1.8   2020-05-19 [?] CRAN (R 4.0.2)
    ##  P munsell        0.5.0   2018-06-12 [?] CRAN (R 4.0.2)
    ##  P pillar         1.6.0   2021-04-13 [?] CRAN (R 4.0.4)
    ##  P pkgconfig      2.0.3   2019-09-22 [?] CRAN (R 4.0.2)
    ##  P purrr        * 0.3.4   2020-04-17 [?] CRAN (R 4.0.2)
    ##  P quantmod       0.4.18  2020-12-09 [?] CRAN (R 4.0.2)
    ##  P R6             2.5.0   2020-10-28 [?] CRAN (R 4.0.2)
    ##  P Rcpp           1.0.6   2021-01-15 [?] CRAN (R 4.0.2)
    ##  P readr        * 1.4.0   2020-10-05 [?] CRAN (R 4.0.2)
    ##  P readxl         1.3.1   2019-03-13 [?] CRAN (R 4.0.2)
    ##  P renv           0.13.2  2021-03-30 [?] CRAN (R 4.0.4)
    ##  P reprex         2.0.0   2021-04-02 [?] CRAN (R 4.0.2)
    ##  P rlang          0.4.11  2021-04-30 [?] CRAN (R 4.0.5)
    ##  P rlist          0.4.6.1 2016-04-04 [?] CRAN (R 4.0.2)
    ##  P rmarkdown      2.7     2021-02-19 [?] CRAN (R 4.0.2)
    ##  P rstudioapi     0.13    2020-11-12 [?] CRAN (R 4.0.2)
    ##  P rvest          1.0.0   2021-03-09 [?] CRAN (R 4.0.2)
    ##  P sass           0.3.1   2021-01-24 [?] CRAN (R 4.0.2)
    ##  P scales         1.1.1   2020-05-11 [?] CRAN (R 4.0.2)
    ##  P selectr        0.4-2   2019-11-20 [?] CRAN (R 4.0.2)
    ##  P sessioninfo    1.1.1   2018-11-05 [?] CRAN (R 4.0.2)
    ##  P SnowballC      0.7.0   2020-04-01 [?] CRAN (R 4.0.2)
    ##  P stopwords    * 2.2     2021-02-10 [?] CRAN (R 4.0.2)
    ##  P stringi        1.5.3   2020-09-09 [?] CRAN (R 4.0.2)
    ##  P stringr      * 1.4.0   2019-02-10 [?] CRAN (R 4.0.2)
    ##  P tibble       * 3.1.1   2021-04-18 [?] CRAN (R 4.0.2)
    ##  P tidyr        * 1.1.3   2021-03-03 [?] CRAN (R 4.0.2)
    ##  P tidyselect     1.1.1   2021-04-30 [?] CRAN (R 4.0.5)
    ##  P tidytext     * 0.3.1   2021-04-10 [?] CRAN (R 4.0.2)
    ##  P tidytuesdayR * 1.0.1   2020-07-10 [?] CRAN (R 4.0.2)
    ##  P tidyverse    * 1.3.1   2021-04-15 [?] CRAN (R 4.0.2)
    ##  P tokenizers     0.2.1   2018-03-29 [?] CRAN (R 4.0.2)
    ##  P TTR            0.24.2  2020-09-01 [?] CRAN (R 4.0.2)
    ##  P usethis        2.0.1   2021-02-10 [?] CRAN (R 4.0.2)
    ##  P utf8           1.2.1   2021-03-12 [?] CRAN (R 4.0.2)
    ##  P vctrs          0.3.8   2021-04-29 [?] CRAN (R 4.0.5)
    ##  P widgetframe  * 0.3.1   2017-12-20 [?] CRAN (R 4.0.2)
    ##  P withr          2.4.2   2021-04-18 [?] CRAN (R 4.0.2)
    ##  P xfun           0.22    2021-03-11 [?] CRAN (R 4.0.2)
    ##  P xml2           1.3.2   2020-04-23 [?] CRAN (R 4.0.2)
    ##  P xts            0.12.1  2020-09-09 [?] CRAN (R 4.0.2)
    ##  P yaml           2.2.1   2020-02-01 [?] CRAN (R 4.0.2)
    ##  P zoo            1.8-9   2021-03-09 [?] CRAN (R 4.0.2)
    ## 
    ## [1] /Users/jvelezmagic/Documents/Github/personal_projects/jvelezmagic/renv/library/R-4.0/x86_64-apple-darwin17.0
    ## [2] /private/var/folders/bt/17212s6j0xxfjty0f77xmfq00000gn/T/RtmpTDBylR/renv-system-library
    ## 
    ##  P ── Loaded and on-disk path mismatch.
