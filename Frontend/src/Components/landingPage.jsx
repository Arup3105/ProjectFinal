import React from 'react'
import '../Components/landingpage.css'
import Footer from './Footer'
function landingPage() {
  return (
    <div className='landingpage'>
      <aside className="profile-card">
        <div className="landing-container">
          <div className="left">
            <img src="/apc.png"  />
          </div>
          <div className="right">
            <p> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas minus eos enim impedit corrupti sapiente nostrum, ipsa, saepe, tempore excepturi obcaecati inventore distinctio dicta accusantium provident qui. Dolores, accusantium quidem.</p>
          </div>
        </div>

        <Footer />



      </aside>
    </div>
  )
}

export default landingPage