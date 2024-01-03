let currentPage = 1;
const imagesPerPage = 10;
let loading = false;
let keyboard = "nature";

async function searchPhotos() {
    loading = false;
    showLoadingSpinner();
    keyword = document.getElementById('searchInput').value;
    console.log(keyword, "search keyword");
    const photoContainer = document.getElementById('photoContainer');
    photoContainer.innerHTML = '';
    currentPage = 1;
    loadMoreImages()
}

async function loadMoreImages() {
    if (loading) {
        return;
    }
    const photoContainer = document.getElementById("photoContainer");
    loading = true;
    if (loading) {
        showLoadingSpinner();
    }
    for (let i = 0; i < imagesPerPage; i++) {
        const uniqueURL = `https://source.unsplash.com/random/?${keyword}`
        try {
            const response = await fetch(uniqueURL);
            const finalURL = response.url;
            const photoBox = createPhotoBox(finalURL, `Image ${i + 1}`)
            photoContainer.appendChild(photoBox);
        } catch (error) {
            console.log("error", error)
        }
    }
    currentPage++;
    loading = false;
    if (!loading) {
        hideLoadingSpinner()
    }
}

function createPhotoBox(imageURL, altText) {
    const photoBox = document.createElement('div')
    photoBox.classList.add('photo-box')

    const img = document.createElement('img');
    img.src = imageURL;
    img.alt = altText;
    photoBox.appendChild(img);

    const downloadBtn = document.createElement('button');
    downloadBtn.classList.add('photo-download-btn');
    downloadBtn.innerHTML = '<i class="fa-solid fa-download"></i>';
    downloadBtn.addEventListener('click', () => downloadImage(imageURL));
    photoBox.appendChild(downloadBtn);

    return photoBox;
}

const loadingSpinner = document.getElementById('loadingSpinner');

function showLoadingSpinner() {
    loadingSpinner.style.display = "block";
}

function hideLoadingSpinner() {
    loadingSpinner.style.display = "none";
}

async function downloadImage(imageURL) {
    try {
        const response = await fetch(imageURL);
        const blob = await response.blob();
        let url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.setAttribute('download', 'Image.jpg');
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.log(error);
    }
}

window.onload = searchPhotos;

document.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight, document.documentElement.offsetHeight);
    if (scrollY >= documentHeight - window.innerHeight && !loading) {
        loadMoreImages();
    }
})