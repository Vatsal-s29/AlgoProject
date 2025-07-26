// import React from 'react'

// const Spinner = () => {
//   return (
//     <div className='animate-ping w-16 h-16 m-8 rounded-full bg-sky-600'></div>
//   )
// }

// export default Spinner

import React from "react";
import { SyncLoader } from "react-spinners";

const Spinner = () => {
    return (
        <div className="flex items-center justify-center h-full">
            {/* <PacmanLoader speedMultiplier={3} /> */}
            <SyncLoader speedMultiplier={2} />
        </div>
    );
};

export default Spinner;
