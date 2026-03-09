document.addEventListener("DOMContentLoaded", function () {
    function generateMemberProfiles() {
      const teamProfilesContainer = document.getElementById("teamProfiles");
  
      fetch("../assets/json/members.json")
        .then((response) => response.json())
        .then((teamMembers) => {
          // Clear the existing content of the teamProfilesContainer
          teamProfilesContainer.innerHTML = "";
  
          teamMembers.forEach((member) => {
            const memberCard = document.createElement("div");
            memberCard.className = "card";
            memberCard.innerHTML = `
            <img src="${member.imageFileName}" alt="${member.name}" style="width:100%">
            <h1 id="memberName">${member.name}</h1>
            <p class="title">${member.title}</p>
            <p id="memberQuote">${member.quote}</p>
            <a href="${member.facebook}" target="_blank"><i class="fa fa-facebook"></i></a>
            <a href="${member.twitter}" target="_blank"><i class="fa fa-twitter"></i></a>
            <a href="${member.linkedIn}" target="_blank"><i class="fa fa-linkedin"></i></a>
            <p><a href="https://mail.google.com" target="_blank"><button id="contactButton">Contact</button></a></p>
          `;
            ;
  
            teamProfilesContainer.appendChild(memberCard);
          });
        })
        .catch((error) => {
          console.error("Error loading team members:", error);
        });
    }
    generateMemberProfiles();
  });
  
