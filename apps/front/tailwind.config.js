/** @type {import('tailwindcss').Config} */

const mainGridColumn = (maxSize, minSize, outerSize, hasOuterMargin) => {
  if (hasOuterMargin) {
    return `minmax(${outerSize}, 1fr) repeat(12, minmax(${minSize}, ${maxSize}px)) minmax(${outerSize}, 1fr)`
  }

  return `repeat(12, minmax(${minSize}, ${maxSize}px))`
}

const calcGridMaxSize = (maxSize, outerMaxSize, gutter) => {
  if (!gutter) {
    return (Number.parseInt(maxSize) - Number.parseInt(outerMaxSize) * 2) / 12
  }

  if (!outerMaxSize) {
    return (Number.parseInt(maxSize) - gutter * 11) / 12
  }

  return (
    (Number.parseInt(maxSize) -
      Number.parseInt(outerMaxSize) * 2 -
      gutter * 11) /
    12
  )
}

module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    'src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/components/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1536px',
      },
    },
    extend: {
      gridTemplateColumns: ({ theme }) => {
        const outerMaxSizeLG = Number.parseFloat(theme('spacing.9')) * 16
        const outerMaxSizeMD = Number.parseFloat(theme('spacing.5')) * 16
        const outerMaxSizeSM = Number.parseFloat(theme('spacing.3')) * 16

        const minGridSizeLG = theme('spacing.5')
        const minGridSizeSM = theme('spacing.5')

        // Max Grid Sizes
        const gridSizeLG = theme('screens.2xl')
        const gridSizeMD = theme('screens.lg')
        const gridSizeSM = theme('screens.sm')

        // Gutter Sizes
        const gutterLG = Number.parseFloat(theme('spacing.8')) * 16
        const gutterMD = Number.parseFloat(theme('spacing.5')) * 16
        const gutterSM = Number.parseFloat(theme('spacing.2')) * 16

        // Calculating single grid Size
        const maxGridSizeLG = calcGridMaxSize(gridSizeLG, outerMaxSizeLG)
        const maxGridSizeMD = calcGridMaxSize(gridSizeMD, outerMaxSizeMD)
        const maxGridSizeSM = calcGridMaxSize(gridSizeSM, outerMaxSizeSM)

        /// Cal Section MAX SIZES
        const maxSecSizeLG = calcGridMaxSize(gridSizeLG, undefined, gutterLG)

        const maxSecSizeMD = calcGridMaxSize(gridSizeMD, undefined, gutterMD)

        const maxSecSizeSM = calcGridMaxSize(gridSizeSM, undefined, gutterSM)

        console.log({
          maxContainerSizeLG: maxSecSizeLG,
          maxContainerSizeSM: maxSecSizeSM,
        })
        /// Container grids - layout & Sections
        return {
          'layout-lg': mainGridColumn(
            maxGridSizeLG,
            minGridSizeLG,
            outerMaxSizeLG,
            true,
          ),
          'layout-md': mainGridColumn(
            maxGridSizeMD,
            minGridSizeLG,
            outerMaxSizeMD,
            true,
          ),
          'layout-sm': mainGridColumn(
            maxGridSizeSM,
            minGridSizeSM,
            outerMaxSizeSM,
            true,
          ),
          'sec-lg': mainGridColumn(
            maxSecSizeLG,
            minGridSizeLG,
            outerMaxSizeLG,
            false,
          ),
          'sec-md': mainGridColumn(
            maxSecSizeMD,
            minGridSizeLG,
            outerMaxSizeMD,
            false,
          ),
          'sec-sm': mainGridColumn(
            maxSecSizeSM,
            minGridSizeSM,
            outerMaxSizeLG,
            false,
          ),
        }
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      screens: {
        xs: '320px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
