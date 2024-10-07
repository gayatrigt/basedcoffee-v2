import React from 'react';
import FeedWrapper from '~/components/FeedWrapper';



const FeedPage: React.FC = () => {


    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-900">
            <FeedWrapper />
        </main>
    );
}

export default FeedPage;