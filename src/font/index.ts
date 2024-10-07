import localFont from 'next/font/local'

export const accentFont = localFont({
    src: './safira-march.otf',
    variable: '--font-safira',
})

export const baseFont = localFont({
    src: [
        {
            path: './epilogue/Epilogue-Thin.woff2',
            weight: '100',
            style: 'normal',
        },
        {
            path: './epilogue/Epilogue-ThinItalic.woff2',
            weight: '100',
            style: 'italic',
        },
        {
            path: './epilogue/Epilogue-ExtraLight.woff2',
            weight: '200',
            style: 'normal',
        },
        {
            path: './epilogue/Epilogue-ExtraLightItalic.woff2',
            weight: '200',
            style: 'italic',
        },
        {
            path: './epilogue/Epilogue-Light.woff2',
            weight: '300',
            style: 'normal',
        },
        {
            path: './epilogue/Epilogue-LightItalic.woff2',
            weight: '300',
            style: 'italic',
        },
        {
            path: './epilogue/Epilogue-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './epilogue/Epilogue-Italic.woff2',
            weight: '400',
            style: 'italic',
        },
        {
            path: './epilogue/Epilogue-Medium.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: './epilogue/Epilogue-MediumItalic.woff2',
            weight: '500',
            style: 'italic',
        },
        {
            path: './epilogue/Epilogue-SemiBold.woff2',
            weight: '600',
            style: 'normal',
        },
        {
            path: './epilogue/Epilogue-SemiBoldItalic.woff2',
            weight: '600',
            style: 'italic',
        },
        {
            path: './epilogue/Epilogue-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: './epilogue/Epilogue-BoldItalic.woff2',
            weight: '700',
            style: 'italic',
        },
        {
            path: './epilogue/Epilogue-ExtraBold.woff2',
            weight: '800',
            style: 'normal',
        },
        {
            path: './epilogue/Epilogue-ExtraBoldItalic.woff2',
            weight: '800',
            style: 'italic',
        },
        {
            path: './epilogue/Epilogue-Black.woff2',
            weight: '900',
            style: 'normal',
        },
        {
            path: './epilogue/Epilogue-BlackItalic.woff2',
            weight: '900',
            style: 'italic',
        },
    ],
    variable: '--font-epilogue',
    display: 'swap',
    preload: true,
})
