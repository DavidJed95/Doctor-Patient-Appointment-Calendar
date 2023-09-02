import React from 'react'

const DynamicImage = ({ src, alt, className }) =>
{
    if (!src) return null;
    return <image className={className} alt={alt} src={src} />
}