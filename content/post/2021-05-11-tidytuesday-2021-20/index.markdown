---
title: "Using Highcharter in TidyTuesday Internet Accesss"
author: Jesús Vélez
date: '2021-05-11'
slug: tidytuesday-2021-20
categories: ["R", "rstats", "TidyTuesday", "dataviz"]
tags: []
subtitle: '2021 - Week 20'
summary: ''
authors: []
lastmod: '2021-05-11T19:01:02-05:00'
featured: no
image:
  caption: ''
  focal_point: 'A US Map highlighting regions that are underserved with broadband internet access, where broadband speeds are 25 Mbps or more. Overall, there are large swaths of the US where internet access is very poor.'
  preview_only: no
projects: []
---

<script src="{{< blogdown/postref >}}index_files/htmlwidgets/htmlwidgets.js"></script>
<script src="{{< blogdown/postref >}}index_files/pymjs/pym.v1.js"></script>
<script src="{{< blogdown/postref >}}index_files/widgetframe-binding/widgetframe.js"></script>

# Internet Access

The data this week comes from
[Microsoft](https://github.com/microsoft/USBroadbandUsagePercentages)
by way of
[The Verge](https://www.theverge.com/22418074/broadband-gap-america-map-county-microsoft-data).

> If broadband access was a problem before 2020, the pandemic turned it into a
> crisis. As everyday businesses moved online, city council meetings or court
> proceedings became near-inaccessible to anyone whose connection couldn’t
> support a Zoom call. Some school districts started providing Wi-Fi hotspots
> to students without a reliable home connection. In other districts, kids set
> up in McDonald’s parking lots just to get a reliable enough signal to do
> their homework. After years of slowly widening, the broadband gap became
> impossible to ignore.

## Libraries

``` r
library(highcharter)
library(janitor)
library(tidytuesdayR)
library(tidyverse)
library(widgetframe)
```

## Get the data

``` r
tuesday_data <- tidytuesdayR::tt_load(2021, week = 20)
```

## Extract data to use

A full description of the data can be found
[here](https://github.com/rfordatascience/tidytuesday/blob/master/data/2021/2021-05-11/readme.md).

``` r
broadband <- tuesday_data$broadband %>%
  glimpse()
```

    ## Rows: 3,143
    ## Columns: 5
    ## $ ST                               <chr> "AL", "AL", "AL", "AL", "AL", "AL", "…
    ## $ `COUNTY ID`                      <dbl> 1001, 1003, 1005, 1007, 1009, 1011, 1…
    ## $ `COUNTY NAME`                    <chr> "Autauga County", "Baldwin County", "…
    ## $ `BROADBAND AVAILABILITY PER FCC` <chr> "0.81", "0.88", "0.59", "0.29", "0.69…
    ## $ `BROADBAND USAGE`                <chr> "0.28", "0.30", "0.18", "0.07", "0.09…

## Download map data

In the `broadband` table, you will find five columns, of which, `COUNTY ID`
represents the identifier of the county in which the broadband usage
metrics are being performed.

Therefore, `COUNTY ID` can be used to locate the broadband usage values of
each county on a map. Here are several alternatives that you could make use of.
However, in this blog, you will use a map of the USA provided by the `Highchart`
team.

In particular, `highcharter` provides two utility functions for accessing and
browsing different common maps:

-   `download_map_data()`: Download the geojson data from the highchartsJS
    collection.
-   `get_data_from_map()`: Get the properties for each region in the map, as the
    keys from the map data.

``` r
map_layout_data <- download_map_data("countries/us/us-all-all.js")
```

If you look askance at the columns of the United States map, you will notice
that there is a column named `fips`; these are unique 5-digit codes to identify
counties in the United States. So, if you consider this, the `COUNTY ID` and
`fips` columns are equivalent. Yes, you may have to make a few adjustments
later, but stick with that idea for now. 👀👌

``` r
get_data_from_map(map_layout_data) %>%
  clean_names() %>% 
  glimpse()
```

    ## Rows: 3,147
    ## Columns: 7
    ## $ hc_group    <chr> "admin2", "admin2", "admin2", "admin2", "admin2", "admin2"…
    ## $ hc_middle_x <dbl> 0.21, 0.34, 0.05, 0.68, 0.55, 0.44, 0.53, 0.30, 0.35, 0.52…
    ## $ hc_middle_y <dbl> 0.41, 0.75, 0.08, 0.77, 0.54, 0.18, 0.30, 0.58, 0.95, 0.48…
    ## $ hc_key      <chr> "us-ca-083", "us-fl-087", "us-mi-033", "us-al-097", "us-co…
    ## $ hc_a2       <chr> "SB", "MO", "CH", "MO", "BR", "AS", "DU", "NA", "FR", "CL"…
    ## $ fips        <chr> "06083", "12087", "26033", "01097", "08014", "55003", "250…
    ## $ name        <chr> "Santa Barbara", "Monroe", "Chippewa", "Mobile", "Broomfie…

## General preprocessing

To replicate the map of
[The Verge by Microsoft](https://www.theverge.com/22418074/broadband-gap-america-map-county-microsoft-data) (*i.e.*, hereinafter referred as `target map`)
you will need to focus only on the two following variables:

| variable         | class     | description                                                                                                                                  |
|:-----------------|:----------|:---------------------------------------------------------------------------------------------------------------------------------------------|
| county\_id       | double    | County ID                                                                                                                                    |
| broadband\_usage | character | Percent of people per county that use the internet at broadband speeds based on the methodology explained above. Data is from November 2019. |

{{% callout note %}}

But wait… maybe you should be asking yourself why you do not need other
indicator variables like `ST` or `COUNTY NAME`?

Well that’s because in a few moments you will use one of the tables provided by
`Highcharts` (described in the section above) to carry out the name mapping of
each county. However, in case you don’t want to use these provided maps you
could keep the other columns and use packages like `zipcodeR` or `tigris` to
help you with the correct mappings. 🤔

{{% /callout %}}

Now, getting back to general data processing, this is a relatively
straightforward task. First, and as a good practice, you will use
`clean_names()` provided by the `janitor` package to convert the names of the
data columns to a standard one. In this way, typing the columns will be simple,
easy to remember, and visibly appropriate. 😇

Then, you will convert the `broadban_usage` column from a **character** type
to a **numeric** type. While you might initially consider using the R base
`as.numeric()` or `type.convert()`, `type_convert()` from the `readr` package
provides a useful interface if you need to do manual work. Select, clean,
and let `type_converter()` take care of the parsing of your variables. 💻🙌

``` r
broadband_processed <- broadband %>%
  clean_names() %>%
  select(county_id, broadband_usage) %>%
  type_convert(
    col_types = cols(
      broadband_usage = col_double()
    ),
    na = "-"
  ) %>%
  glimpse()
```

    ## Rows: 3,143
    ## Columns: 2
    ## $ county_id       <dbl> 1001, 1003, 1005, 1007, 1009, 1011, 1013, 1015, 1017, …
    ## $ broadband_usage <dbl> 0.28, 0.30, 0.18, 0.07, 0.09, 0.05, 0.11, 0.32, 0.34, …

## Prepare data for plot

Our data is clean, however, to build the `target map` with `highcharter`,
you will need to transform it a bit. To begin with, the data does not have
information of broadband usage on certain places (*i.e.*, data with `NA`) and,
the `county_id` are not five-character codes, but four-character. Therefore,
you must add a zero to those under four characters. 😬✅

Besides, the `target map` shows two categories to highlight the problem of
broadband use. Specifically, those counties that use a broadband speed less
than or greater than and equal to 15%. You must apply this condition to
categorize the data in the `broadband` table.

Finally, it is time to transform the data into a format that `highcharter` can
understand. To do this, you will create a list of series, one serie for each
category of the map you want to display. Hence, you will use `group_nest()` to
create a subset of data per group. Then, you can add metadata for each series,
for example, a color variable. Now, you can transform each subset of data to a
list format that `highcharter` can understand with `list_parse()`.

{{% callout note %}}

Importantly, each subset has columns named exactly as the base `highcharter`
chart needs with some metadata. For example, to recreate the `target map` each
category has the columns: name, value, and fips. Of which, only `fips` is a
metadata variable. 😋👉👈

{{% /callout %}}

``` r
broadband_series_data <- broadband_processed %>%
  filter(!is.na(broadband_usage)) %>%
  transmute(
    # Transform to a fips format ------------------------------------------
    fips = str_pad(
      string = county_id,
      width = 5,
      side = "left",
      pad = "0"
    ),
    # Categorize data -----------------------------------------------------
    value = broadband_usage * 100,
    name = if_else(
      condition = value < 15,
      true = "< 15%",
      false = ">= 15%"
    )
  ) %>%
  # Transform data so that highcharter accepts it. -------------------------
  group_nest(name) %>%
  mutate(
    color = c("#0B0073", "#B6B8B8"),
    data = map(data, list_parse)
  ) %>%
  glimpse()
```

    ## Rows: 2
    ## Columns: 3
    ## $ name  <chr> "< 15%", ">= 15%"
    ## $ data  <list> [["01007", 7], ["01009", 9], ["01011", 5], ["01013", 11], ["0101…
    ## $ color <chr> "#0B0073", "#B6B8B8"

{{% callout note %}}

I need to tell you that there is another way to create choropleths
of categorical areas using
[dataClasses](https://jkunst.com/highcharter/articles/maps.html#categorized-areas-1).
😬
However, honestly, the process of creating the `dataClasses`
does not seem as intuitive to me as the version used in this blog
(*i.e.*, using `group_nest()`). 😅
Who knows. Observe, discuss and leave in the comments how you create them!
🧐🥴

{{% /callout %}}

## United States Broadband Usage Percentages figure

Well, you’ve done a ton of stunts to get here, but now is the time to create
the `target map`. Are you ready? Let’s do it! 🤭🤭🤭

![](https://media.giphy.com/media/DoCIC5Pxp57qg/giphy.gif)

The first step is to map the data to a graph. For this, you will use
`highchart()` to define that the desired graph is of the `map` type.

Next, you will define how you want to display each of your data groups.
For instance, groups below or above 15% broadband usage.
Using `hc_plotOptions()`, you can configure the behavior of each series when
plotting. In turn, you can also overwrite the default values by adding more
columns of metadata (*e.g.*, color) in the data created with `list_parse()`.
So when you run `hc_add_series_list()`, they will all share the parameters
used in `hc_plotOptions()`, but you can always overwrite some as you like. 😋

Although you built a similar graph to the `target map` with the previous step,
it is time for you to add the corresponding text annotations. Normally, HTML
within the `highcharter` charts is not necessary, much less mandatory. However,
if required, you can use the `useHTML = TRUE` parameter within each display
text call (*e.g.*, `hc_title()`, `hc_subtitle()`, etc.). In this way, all the
strings that you define will be treated as HTML, and you will have freer
control over how and where to display which pieces of text. 🤗

The result so far should look almost identical; only one thing is
missing, the navigation buttons. By default, the navigation
buttons are disabled, so you must activate them with
`hc_mapNavigation()`. To position it in a specific place, use
the `buttonOptions` parameter. With it, you can change the
alignment with the parameters `align`, `verticalAlign`. To
mention, you can also find these parameters in the positioning
of the legend or texts. 🤓

{{% callout note %}}

It would be best to use `frameWidget()` to display `highcharter` plots within
static pages. Inside a Rmarkdown or a Shiny app, it might not be necessary. 😬

{{% /callout %}}

``` r
highchart(
  type = "map"
) %>%
  # How do you want to display the data? ----------------------------------
  hc_plotOptions(
    map = list(
      allAreas = FALSE,
      joinBy = "fips",
      value = "value",
      mapData = map_layout_data
    ),
    series = list(
      states = list(
        inactive = list(
          opacity = 0.7
        )
      )
    )
  ) %>% 
  hc_add_series_list(broadband_series_data) %>%
  # Display text as in original source. -----------------------------------
  hc_title(
    text = "
      <p style='text-align:center;'>
        <b>THIS IS A MAP OF AMERICAN'S BROADBAND PROBLEM</b>
        <br>
        A county-by-county look at the broadband gap
      </p>
    ",
    align = "center",
    useHTML = TRUE
  ) %>%
  hc_subtitle(
    text = "
      By <a href=''>Russell Brandom</a>
      and <a href=''>William Joel</a> | May 10, 2021, 9:00am EDT
    ",
    align = "center",
    useHTML = TRUE
  ) %>%
  hc_caption(
    text = "
      Map: The Verge. The database does not include broadband rates for
      Oglala Lakota County, South Dakota, or Kusilvak Census Area, Alaska,
      because of a coding irregularity. Source: 
      <a href='https://github.com/microsoft/USBroadbandUsagePercentages'>
        Microsoft
      </a> 
       - 
      <a href='https://www.theverge.com/22418074/broadband-gap-america-map-county-microsoft-data'>
      Get the data
      </a>.
    ",
    useHTML = TRUE
  ) %>%
  hc_legend(
    title = list(
      text = "
        Percentage of people using the internet at 25Mbps or above per county.
        "
      ),
    align = "left",
    symbolHeight = 12,
    symbolWidth = 12,
    symbolRadius = 0,
    squareSymbol = FALSE
  ) %>%
  hc_tooltip(
      pointFormat = "
        <b>{point.name}</b><br>
        <br>
        <b>{point.value}%</b><br>
        Percent using broadband speed
        ",
      useHTML = TRUE
  ) %>%
  hc_credits(
    text = "
      <b>Replica made by: </b> 
      <a href='https://twitter.com/jvelezmagic'>@jvelezmagic</a>
    ",
    enabled = TRUE,
    useHTML = TRUE
  ) %>%
  # Customize zoom options ------------------------------------------------
  hc_mapNavigation(
    enabled = TRUE,
    enableMouseWheelZoom = FALSE,
    buttonOptions = list(
      align = "right",
      verticalAlign = "bottom"
    )
  ) %>%
  # Include your favorite theme! -----------------------------------------
  hc_add_theme(
    hc_thm = hc_theme_elementary()
  ) %>%
  # Display as iframe -----------------------------------------------------
  frameWidget() %>% 
  identity()
```

<div id="htmlwidget-1" style="width:100%;height:480px;" class="widgetframe html-widget"></div>
<script type="application/json" data-for="htmlwidget-1">{"x":{"url":"index_files/figure-html//widgets/widget_united_states_broadband_usage_percentages_figure.html","options":{"xdomain":"*","allowfullscreen":false,"lazyload":false}},"evals":[],"jsHooks":[]}</script>

<br>

Congratulations, you have learned to create a handy map to share to show a
problem of interest. I hope to see you soon with another blog. 😋✨✨✨

## Session info

    ## ─ Session info ───────────────────────────────────────────────────────────────
    ##  setting  value                                      
    ##  version  R version 4.0.5 Patched (2021-04-30 r80259)
    ##  os       macOS Big Sur 10.16                        
    ##  system   x86_64, darwin17.0                         
    ##  ui       X11                                        
    ##  language (EN)                                       
    ##  collate  en_US.UTF-8                                
    ##  ctype    en_US.UTF-8                                
    ##  tz       America/Mexico_City                        
    ##  date     2021-05-16                                 
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
    ##  P janitor      * 2.1.0   2021-01-05 [?] CRAN (R 4.0.2)
    ##  P jquerylib      0.1.4   2021-04-26 [?] CRAN (R 4.0.2)
    ##  P jsonlite       1.7.2   2020-12-09 [?] CRAN (R 4.0.2)
    ##  P knitr          1.33    2021-04-24 [?] CRAN (R 4.0.2)
    ##  P lattice        0.20-41 2020-04-02 [?] CRAN (R 4.0.5)
    ##  P lifecycle      1.0.0   2021-02-15 [?] CRAN (R 4.0.2)
    ##  P lubridate      1.7.10  2021-02-26 [?] CRAN (R 4.0.2)
    ##  P magrittr       2.0.1   2020-11-17 [?] CRAN (R 4.0.2)
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
    ##  P snakecase      0.11.0  2019-05-25 [?] CRAN (R 4.0.2)
    ##  P stringi        1.5.3   2020-09-09 [?] CRAN (R 4.0.2)
    ##  P stringr      * 1.4.0   2019-02-10 [?] CRAN (R 4.0.2)
    ##  P tibble       * 3.1.1   2021-04-18 [?] CRAN (R 4.0.2)
    ##  P tidyr        * 1.1.3   2021-03-03 [?] CRAN (R 4.0.2)
    ##  P tidyselect     1.1.1   2021-04-30 [?] CRAN (R 4.0.5)
    ##  P tidytuesdayR * 1.0.1   2020-07-10 [?] CRAN (R 4.0.2)
    ##  P tidyverse    * 1.3.1   2021-04-15 [?] CRAN (R 4.0.2)
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
    ## [2] /private/var/folders/bt/17212s6j0xxfjty0f77xmfq00000gn/T/RtmpOaZ9Zc/renv-system-library
    ## 
    ##  P ── Loaded and on-disk path mismatch.
