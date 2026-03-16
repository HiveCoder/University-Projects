document.addEventListener("DOMContentLoaded", function () {
    fetch('sdgs.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('putSdgsHere');
            data.forEach(sdg => {
                const card = `
    <div class="col-6 col-sm-4 col-md-3 col-lg-2 p-1">
        <div class="flip-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <img src="${sdg.image}" width="200px" height="200px">
                </div>
                <div class="flip-card-back">
                    <h1>SDG ${sdg.id}</h1>
                    <p>${sdg.title}</p>
                    <p>${sdg.description}</p>
                </div>
            </div>
        </div>
    </div>
`;

                container.innerHTML += card;
            });
        })
        .catch(error => console.error('Error loading SDGs:', error));
});
