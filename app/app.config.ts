export default defineAppConfig({
  // https://ui3.nuxt.dev/getting-started/theme#design-system
  ui: {
    colors: {
      primary: 'emerald',
      neutral: 'slate',
    },
    button: {
      defaultVariants: {
        // Set default button color to neutral
        // color: 'neutral'
      }
    },
    navigationMenu: {
      slots: {
        root: 'gap-4',
        link: 'font-medium text-md',
        linkLeadingIcon: 'size-6',
        linkTrailingIcon: 'size-6',
      },
      variants: {
        orientation: {
          vertical: {
            root: 'flex-col',
            link: 'py-2',
            childList: 'ms-5 border-s border-[var(--ui-border)]',
            childItem: 'ps-1.5 -ms-px'
          }
        }
      },
    }
  }
})
