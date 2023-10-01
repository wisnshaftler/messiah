import fs from 'fs';

export default async function Page({ params }) {
    const handle = params.handle || '';

    let postContent = await new Promise((resolve, reject) => {
        fs.readFile("./src/row/posts/" + handle + ".txt", 'utf-8', function (err, data) {
            if (err) resolve(null)
            resolve(data);
        });
    })

    if (postContent === null) {
        return (<p>No post detected</p>);
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">

                <div dangerouslySetInnerHTML={{__html: postContent}}></div>
            </div>
        </main>
    );
}