import React from 'react';
import FeedWrapper from '~/components/FeedWrapper';



const CreatePage: React.FC = () => {
    return (
        <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-slate-900">
            <FeedWrapper />
        </main>
    );
}

export default CreatePage;