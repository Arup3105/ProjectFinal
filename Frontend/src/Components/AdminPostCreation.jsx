import React from 'react'

const AdminPostCreation = () => {
    return (
        <div>
            <form action="#">
                <input type="text" placeholder='Title' />
                <input type="text" placeholder='Desc...'/>
                <input type="text" placeholder='Addiional Info...'/>
            </form>
            <button>Add Post</button>
        </div>
    )
}

export default AdminPostCreation
