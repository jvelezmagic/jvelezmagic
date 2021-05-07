---
title: Learn how to use Utterances with Acadamic Hugo theme in blogdown!
author: Jesús Vélez
date: '2021-05-06'
slug: learn-how-to-use-utterances-with-acadamic-hugo-blogdown
categories: ["blogdown", "customization"]
tags: ["blogdown", "customization"]
subtitle: 'Configure a new comments provider'
summary: ''
authors: []
lastmod: '2021-05-06T20:51:47-05:00'
featured: no
image:
  caption: 'Person using black iPad'
  focal_point: ''
  preview_only: no
projects: []
---

## Why did I decide to leave Disqus and use Utterances?

## Add Utterances as a new comments provider

### Before

```yaml
comments:
  provider: 'disqus'
  commentable:
    post: true
    book: true
    project: true
    publication: true
    event: true
  disqus:
    shortname: 'jvelezmagic'
    show_count: true
  commento:
    url: ''
```

### After

```yaml
comments:
  provider: 'utterances'
  commentable:
    post: true
    book: true
    project: true
    publication: true
    event: true
  disqus:
    shortname: 'jvelezmagic'
    show_count: true
  commento:
    url: ''
  utterances:
    repo: 'jvelezmagic/jvelezmagic'
    issue_term: 'title'
    label: 'web page comment'
    theme: 'github-light'
```

## Map Utterances parameters to a html view

```html
{{ if site.Params.comments.utterances.repo }}
<script src="https://utteranc.es/client.js"
        repo="{{ site.Params.comments.utterances.repo }}"
        issue-term="{{ site.Params.comments.utterances.issue_term }}"
        label="{{ site.Params.comments.utterances.label }}"
        theme="{{ site.Params.comments.utterances.theme }}"
        crossorigin="anonymous"
        async>
</script>
{{ end }}
```

## Conlusion
