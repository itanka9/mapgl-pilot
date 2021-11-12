import React from 'react';

export function Welcome(props: { name: string }) {
    return <h1>Hello, {props.name}</h1>;
}