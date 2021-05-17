---
title: Learn how to use Utterances with Academic Hugo theme in blogdown!
author: Jesús Vélez
date: '2021-05-06'
slug: learn-how-to-use-utterances-with-academic-hugo-blogdown
categories: ["blogdown", "customization", "hugo"]
tags: ["blogdown", "customization", "hugo"]
subtitle: 'Configure a new comments provider'
summary: 'Say goodbye to Disqus ads and learn how to integrate Utterances, a "lightweight comments widget built on GitHub issues".'
authors: []
lastmod: '2021-05-17T20:51:47-05:00'
featured: no
image:
  caption: 'Person using black iPad'
  focal_point: ''
  preview_only: no
projects: []
links:
- icon: github
  icon_pack: fab
  name: Commit code
  url: https://github.com/jvelezmagic/jvelezmagic/commit/93d4323545dd07cf649049aac79f6869f7a26b34
---

## Why did I decide to leave Disqus and use Utterances?

You may think that I had great reasons to use `Disqus` instead of `Utterances`,
but the truth is that I did not. For the most part, it was for fun and
learning, but not having ads really sold me. 🤭

I knew that people I admire very much, like 
[Julia Silge](https://juliasilge.com/)
or 
[Alison Hill](https://alison.rbind.io/),
had made this migration not long ago. I wondered how they did it specifically
since they also used the **Academic Hugo Theme** template. I went into their
Github repositories and saw their commits about it.

Commits:

- Julia Silge: [juliasilge/juliasilge.com@e7ea07d](https://github.com/juliasilge/juliasilge.com/commit/e7ea07d23df50a9fc347d83f68cb44e7e288207c)
- Alison Hill: [rbind/apreshill@50127ff](https://github.com/rbind/apreshill/commit/50127ff87f2ea6f225c1fd1e2b2f60d953ae8e9c)

I noticed that they had overwritten the article page template. I thought it
sounded good, I replicated it, and it worked. However, a part of me thought
that, just as you could **overwrite** that template, I could generate
a new HTML that would point to the `Utterances` configuration. I went ahead
and got it. Here I show you how. 👀

## Add Utterances as a new comments provider

The first step was to visualize what I wanted to achieve;
therefore, I decided to add the parameters required by
`Utterances` in the configuration file:
`./config/_default/params.yaml`

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

With `Utterances` added to the configuration file, I could now choose between
three comment providers: `disqus`, `commento` and `utterances`.
However, as expected, when trying to initialize the page server,
I got the following error:

{{% callout warning %}}

The 'utterances' comment provider was not found.

... # Unimportant things...

error calling partial: partial "comments/utterances.html" not found.
{{% /callout %}}

Therefore, I assumed that I should create a file named in this way
in my folder of partials, specifically at:
`layouts/partials/comments/utterances.html`

First, I tried to copy verbatim the content that `Utterances` gave me for my
repository. I pasted it on, and it worked like a charm. `Utterances` were now
enabled for all my pages on my website. 🤗✨

However, if I already configured `Utterances` in the parameters file,
the correct thing to do would be to map them to a HTML view for formality.
So I added the following to my `utterances.html` file. 👨🏽‍💻👇

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

With this added, `Utterances` felt like an extension that I can jump back and
forth from since it completely preserves the way of inserting comments on
`Hugo's theme` pages. 😋

## Conclusion

Setting up `Utterances` turned out to be a simple task from which I learned a
little more about how Hugo's templates work. 😋 Although you have `Utterances`
available without any problem, passing the comments from one platform to another
could be a more complicated task. 🧐

Personally, I'm just getting started, and I had no comments, so migrate from
one comment provider to another was not a problem for me. 😅 The first post I
reviewed about this problem is:
"[Goodbye, Disqus! Hello, Utterances!](https://masalmon.eu/2019/10/02/disqus/)".
I really found it very useful, and it could be the next step for you. 😇

You can find the commit with which I made these changes here:
[jvelezmagic/jvelezmagic@93d4323](https://github.com/jvelezmagic/jvelezmagic/commit/93d4323545dd07cf649049aac79f6869f7a26b34). Enjoy! 🥳🙌
