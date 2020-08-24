// Get the body
const body = document.getElementsByTagName('body')[0];

// Get the modal
const modal = document.getElementById('projectDetails');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        body.style.overflow = 'auto';
    }
}
