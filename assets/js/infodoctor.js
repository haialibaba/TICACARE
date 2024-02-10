import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxCtVmIC2bjzHDOPCJDPxVpo4_X1rxw5g",
  authDomain: "healthcare-6b52f.firebaseapp.com",
  databaseURL: "https://healthcare-6b52f-default-rtdb.firebaseio.com",
  projectId: "healthcare-6b52f",
  storageBucket: "healthcare-6b52f.appspot.com",
  messagingSenderId: "58612057787",
  appId: "1:58612057787:web:88e53a2eb89b36959b0b9e",
  measurementId: "G-KMXKKRR3DJ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
////////////////////////////////////////////////////////////////
// Hàm để lấy dữ liệu tài khoản từ Firebase
function fetchRVFromFirebase(callback) {
  const dbRef = ref(database, 'review/'); // Thay 'doctors' bằng đường dẫn thực của bạn
  onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
  });
}
function fetchKHFromFirebase(callback) {
  const dbRef = ref(database, 'account/'); // Thay 'doctors' bằng đường dẫn thực của bạn
  onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
  });
}
////////// Nút ẩn hiện 
function hideButton() {
  // Lấy tham chiếu đến các button và các div thông tin tương ứng
  const btnShows = document.querySelectorAll("i[id^='btn-show']");
  const infos = document.querySelectorAll("div[id^='content-info']");

  // Thêm sự kiện click cho từng button
  btnShows.forEach((btnShows, index) => {
    btnShows.addEventListener("click", () => {
      // Kiểm tra trạng thái hiện tại của thông tin
      if (infos[index].style.display === "none") {
        // Nếu đang ẩn, hiển thị thông tin
        infos[index].style.display = "block";
      } else {
        // Nếu đang hiển thị, ẩn thông tin
        infos[index].style.display = "none";
      }
    });
  });
}

///////// Nút chi tiết và đánh giá
const btnInfo = document.getElementById("btn-info");
const btnReview = document.getElementById("btn-review");
const tab1 = document.getElementById("tab-1");
const tab2 = document.getElementById("tab-2");

function twoButtonClick(btnInfo, btnReview, tab1, tab2) {
  tab1.style.display = 'block';
  btnInfo.addEventListener("click", () => {
    if (!btnInfo.classList.contains('dock')) {
      btnInfo.classList.add('dock');
      btnReview.classList.remove('dock');
      tab1.style.display = 'block';
      tab2.style.display = 'none';
    }
  })

  btnReview.addEventListener("click", () => {
    if (!btnReview.classList.contains('dock')) {
      btnReview.classList.add('dock');
      btnInfo.classList.remove('dock');
      tab2.style.display = 'block';
      tab1.style.display = 'none';
    }
  })
}

/////////////// hiển thị thông tin bác sĩ với url
const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams)
const id = urlParams.get('id');
const NameN = urlParams.get('name');
console.log(id, NameN)

function displayDetailDoctor(IDBS, NameN) {
  const dbRef = ref(database, 'doctors/');
  onValue(dbRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      if (childData.IDBS == IDBS) {
        const detailDoctor = `
          <img src="assets/img/doctors/doctors-1.jpg" alt="Bác sĩ">
          <div class="infomation">
            <h2>${childData.NameBS}</h2>
            <p>Tuổi: ${childData.AgeBS}</p>
            <p>Chuyên khoa: ${NameN}</p>
          </div>
        </div>`;
        document.getElementById("doctor-title").innerHTML = detailDoctor;

      }
    })

  })
}
////////// run khi load trang
document.addEventListener("DOMContentLoaded", function () {
  hideButton()
  twoButtonClick(btnInfo, btnReview, tab1, tab2)
  displayDetailDoctor(id, NameN);
  fetchRVFromFirebase((data) => {
    fetchKHFromFirebase((data1) => {
      displayRV(data, data1);
    });
  });
})
///////////////Hiển thị đánh giá
function displayRV(data, data1){
  const review = Object.values(data).filter((doctor) => doctor.IDBS === id);
  var reviewsList = document.getElementById('userReviews');
  reviewsList.innerHTML = "";
  for(const child of review){
    const accounts = Object.values(data1).filter((account) => account.IDTK === child.IDTK);
    for(const childata of accounts){
      var listItem = document.createElement('li');
        listItem.classList.add('comment'); // Thêm class 'comment' cho CSS styling

        // Tạo nội dung cho thẻ li
        var reviewContent = `
            <img src="assets/img_info/klein_morreti.jpg" alt="" class="user-avatar">
            <div class="user-info">
                <div class="detail-review">
                  <h4>${childata.NameKH}</h4>
                  <div class="stars-container">
                      <div class="stars">${'★'.repeat(child.starCount)}</div>
                  </div>
                </div>
                <p>${child.Detail}</p>
            </div>
        `;

        listItem.innerHTML = reviewContent;
        reviewsList.appendChild(listItem);
    }
    
  }
}