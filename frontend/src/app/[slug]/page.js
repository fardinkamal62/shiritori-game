'use client';

import GamePage from "./GamePage";

export default async function Page(props) {
    const params = await props.params;
    console.log(params.slug)

    return (
        <GamePage params={params}/>
    );
}
