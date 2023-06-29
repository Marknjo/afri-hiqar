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

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `hsla(var(${variableName}), ${opacityValue})`
    }
    return `hsl(var(${variableName}))`
  }
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
          auto: `repeat(auto-fit, minmax(${theme('spacing.24')}, min-content))`,
        }
      },
      colors: {
        border: withOpacity('--border'),
        input: withOpacity('--input'),
        ring: withOpacity('--ring'),
        background: withOpacity('--background'),
        foreground: withOpacity('--foreground'),
        primary: {
          DEFAULT: withOpacity('--primary'),
          foreground: withOpacity('--primary-foreground'),
          indigo: {
            1: withOpacity('--indigo-1'),
            2: withOpacity('--indigo-2'),
            3: withOpacity('--indigo-3'),
            4: withOpacity('--indigo-4'),
            5: withOpacity('--indigo-5'),
            6: withOpacity('--indigo-6'),
            7: withOpacity('--indigo-7'),
            8: withOpacity('--indigo-8'),
            9: withOpacity('--indigo-9'),
            10: withOpacity('--indigo-10'),
            11: withOpacity('--indigo-11'),
            12: withOpacity('--indigo-12'),
          },
        },
        secondary: {
          DEFAULT: withOpacity('--secondary'),
          foreground: withOpacity('--secondary-foreground'),
          sky: {
            1: withOpacity('--sky-1'),
            2: withOpacity('--sky-2'),
            3: withOpacity('--sky-3'),
            4: withOpacity('--sky-4'),
            5: withOpacity('--sky-5'),
            6: withOpacity('--sky-6'),
            7: withOpacity('--sky-7'),
            8: withOpacity('--sky-8'),
            9: withOpacity('--sky-9'),
            10: withOpacity('--sky-10'),
            11: withOpacity('--sky-11'),
            12: withOpacity('--sky-12'),
          },
        },
        destructive: {
          DEFAULT: withOpacity('--destructive'),
          foreground: withOpacity('--destructive-foreground'),
        },
        muted: {
          DEFAULT: withOpacity('--muted'),
          foreground: withOpacity('--muted-foreground'),
        },
        accent: {
          DEFAULT: withOpacity('--accent'),
          foreground: withOpacity('--accent-foreground'),
          gold: {
            1: withOpacity('--gold-1'),
            2: withOpacity('--gold-2'),
            3: withOpacity('--gold-3'),
            4: withOpacity('--gold-4'),
            5: withOpacity('--gold-5'),
            6: withOpacity('--gold-6'),
            7: withOpacity('--gold-7'),
            8: withOpacity('--gold-8'),
            9: withOpacity('--gold-9'),
            10: withOpacity('--gold-10'),
            11: withOpacity('--gold-11'),
            12: withOpacity('--gold-12'),
          },
        },
        popover: {
          DEFAULT: withOpacity('--popover'),
          foreground: withOpacity('--popover-foreground'),
        },
        card: {
          DEFAULT: withOpacity('--card'),
          foreground: withOpacity('--card-foreground'),
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
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}
