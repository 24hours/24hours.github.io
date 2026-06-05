/** Site configuration — edit this file to customize your blog. */
export const site = {
  /** Production URL (no trailing slash). */
  baseUrl: 'https://24hours.github.io',
  /** GitHub Pages subpath, e.g. "/repo-name". Leave empty for root deploy. */
  repoSubpath: '',
  title: '2424',
  author: 'Lee Yeong Khang',
  githubProfileUrl: 'https://github.com/24hours',
  /** UI language: "zh-CN" | "en" */
  language: 'en' as 'zh-CN' | 'en',
  maxPostsOnIndex: 10,
  copyright: {
    enable: false,
    type: 'CC_BY_NC_SA_4_0' as const,
    customText: '',
    showLicenseIcon: true,
    showStandardFormat: true,
    additionalNote: '',
  },
} as const;

export type SiteConfig = typeof site;
