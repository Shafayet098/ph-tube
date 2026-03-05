// navigation after ALL button
const showLoader =()=>{
    document.getElementById('loader').classList.remove('hidden')
    document.getElementById('video-container').classList.add('hidden')
}
const removeLoader =()=>{
    document.getElementById('loader').classList.add('hidden')
    document.getElementById('video-container').classList.remove('hidden')
}

const loadCategories = () => {
    //Fetch the data
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        //Convert Promise to JSON
        .then(res => res.json())
        //Convert JSON to JS format
        .then(data => dynamicCate(data.categories))
}
const dynamicCate = (categories) => {
    const categoriesContainer = document.getElementById('categories-container');

    for (const cat of categories) {
        // console.log(cat.category_id)
        const div = document.createElement('div');
        div.innerHTML = `
            <button id="btn-${cat.category_id}" onclick="categoryWiseVideo(${cat.category_id})"  class="btn btn-sm hover:bg-[#FF1F3D] hover:text-white">${cat.category}</button>
        `
        categoriesContainer.appendChild(div);
        // console.log(cat.category)
    }
}
loadCategories();


//openapi.programming-hero.com/api/phero-tube/videos?title=shape
//Videos
const loadVideos = (id='') => {
    showLoader();
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${id}`)
        .then(res => res.json())
        .then(data => {
            removeBtnClass();
            document.getElementById('btn-all').classList.add('active')
            displayVideo(data.videos)
        })
}
const loadVideoDetails = (videoID) => {
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoID}`
    fetch(url)
        .then(res => res.json())
        .then(data => displayVideoDetails(data.video))
}
const displayVideoDetails = (video) => {
    console.log(video)
    document.getElementById('modal_dialog').showModal();
    const detailsContainer = document.getElementById('details_container');
    detailsContainer.innerHTML = `
    <div class="card bg-base-100 image-full  shadow-sm">
  <figure>
    <img class=w-full
      src="${video.thumbnail}" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">${video.title}</h2>
    <p>${video.description}</p>
    
  </div>
</div>
    `

}

const displayVideo = (videos) => {
    // console.log(videos)
    
    const videoContainer = document.getElementById('video-container');
    videoContainer.innerHTML = ``;
    if (videos.length == 0) {
        removeLoader();
        videoContainer.innerHTML = `
        <div class="col-span-full text-center flex flex-col items-center justify-center pt-12">
            <img class="w-[120px]" src="./assets/Icon.png" alt="">
            <h2 class="font-bold text-2xl">Oops!! Sorry, There is no content here</h2>
       </div>
        `;
        return;
    }

    videos.forEach(video => {
        // console.log(video)
        const card = document.createElement('div');
        card.innerHTML = `
   <div class="card bg-base-100 flex flex-col gap-5">
            <figure class="relative">
                <img class="w-full h-[150px] object-cover" src="${video.thumbnail}" />
                <span class="absolute text-white bg-black bottom-2 right-3 rounded px-1 text-sm">3hrs 56 min ago</span>
            </figure>
            <div class="flex gap-5">
                <div class="avatar h-8 w-8">
                    <div class="ring-primary ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
                        <img src="${video.authors[0].profile_picture}" />
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <h1 class="font-bold text-xl">${video.title}</h1>
                    <div class="flex gap-2">
                        <p class="text-slate-600">${video.authors[0].profile_name}</p>
                        <p>${video.authors[0].verified == true?`<img class="w-7" src="./assets/icons8-verified-48.png" alt="">` : ``}</p>
                        
                    </div>
                    <p class="text-slate-600">${video.others.views}</p>
                </div>

            </div>
            <button onclick="loadVideoDetails('${video.video_id}')" class="btn btn-block">Show Details</button>
           
        </div>
    `
        videoContainer.appendChild(card);
    });
    removeLoader();
    

}


const categoryWiseVideo = (id) => {
    showLoader();
    const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeBtnClass();
            const btn = document.getElementById(`btn-${id}`);
            btn.classList.add('active');
            displayVideo(data.category);

        })

}
// categoryWiseVideo(1001)

const removeBtnClass = () => {
    const btnClass = document.getElementsByClassName('active');
    for (const btn of btnClass) {
        btn.classList.remove('active');
        // console.log(btn)
    }

}

const searchInput = document.getElementById('search_input').addEventListener('keyup',(event)=>{
    const searchEvent = event.target.value;
    loadVideos(searchEvent);
})