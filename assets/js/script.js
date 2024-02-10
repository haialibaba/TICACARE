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

//////////Get data from Firebase////////////////////////////////////////
function fetchDepartmentFromFirebase(callback) {
  const dbRef = ref(database, 'department/'); // Thay 'doctors' bằng đường dẫn thực của bạn

  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
}

function fetchDoctorFromFirebase(callback) {
  const dbRef = ref(database, 'doctors/'); // Thay 'doctors' bằng đường dẫn thực của bạn

  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
}

////////// Display Department////////////////////////////////////////////
function showDepartment(data) {
  const khoalist = document.getElementById('khoa-list');
  const khoaname = document.getElementById('dept-name');
  const khoadecription = document.getElementById('dept-decription');
  const depart = Object.values(data);
  for (const childData of depart) {
    const khoaButton = document.createElement("li");
    khoaButton.innerHTML = childData.NameN;
    khoaButton.classList.add("text-center");
    khoaButton.addEventListener("click", () => {
      let currentPageChild = 1;
      const allItems = document.querySelectorAll('#khoa-list li');
      allItems.forEach(item => {
        item.classList.remove('show');
      });
      khoaButton.classList.add("show");
      fetchDoctorFromFirebase((data) => {
        showDoctor(childData.IDN, childData.NameN, data);
        fetchDataAndDisplayPageChild(currentPageChild, data, childData.IDN)
      });
      khoaname.innerHTML = childData.NameN;
      khoadecription.innerHTML = childData.Decription;
    });

    khoalist.appendChild(khoaButton);
  }
}
////////////// Display Doctor from department///////////////////////////////////////////
function showDoctor(IDN, NameN, data) {
  const doctorlist = document.getElementById('doctor-list');
  const doctors = Object.values(data).filter((doctor) => doctor.IDN === IDN);
  doctorlist.innerHTML = '';
  for (const childData of doctors) {
    const doctorButton = createDoctorButton(childData, childData.IDBS, NameN)
    doctorlist.appendChild(doctorButton);
  }

}
//////////////Search Doctors//////////////////////////////////////////////////////////////////////////////////////
function searchDoctorByName(name, data) {
  const doctorlist = document.getElementById('doctor-list');
  const dbRef1 = ref(database, 'department/');
  const doctors = Object.values(data)
  doctorlist.innerHTML = '';
  for (const childData of doctors) {
    onValue(dbRef1, (snapshot1) => {
      snapshot1.forEach((childSnapshot1) => {
        const childData1 = childSnapshot1.val();
        if (childData.IDN == childData1.IDN) {
          const NameN = childData1.NameN;
          if (childData.NameBS.toLowerCase().indexOf(name) > -1) {
            const doctorButton = createDoctorButton(childData, childData.IDBS, NameN)
            doctorlist.appendChild(doctorButton);
          }
        }
      })
    })
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getAllDoctor(data) {
  const doctorlist = document.getElementById('doctor-list');
  const dbRef1 = ref(database, 'department/');
  const doctors = Object.values(data)
  doctorlist.innerHTML = '';
  for (const childData of doctors) {
    onValue(dbRef1, (snapshot1) => {
      snapshot1.forEach((childSnapshot1) => {
        const childData1 = childSnapshot1.val();
        if (childData.IDN == childData1.IDN) {
          const NameN = childData1.NameN;
          const doctorButton = createDoctorButton(childData, childData.IDBS, NameN)
          doctorlist.appendChild(doctorButton);
        }
      })
    })
  }

}
//////////////Create Doctor Button/////////////////////////////////////////////////////////
function createDoctorButton(doctor, IDBS, NameN) {
  const doctorButton = document.createElement("button");
  doctorButton.innerHTML = generateDoctorHTML(doctor, NameN);
  doctorButton.classList.add("doctor-button");
  doctorButton.addEventListener("click", () => {
    goToDoctorDetailPage(IDBS, NameN)
  });
  return doctorButton;
}
/////////////Display info Doctor//////////////////////////////////////////////////////////////
function generateDoctorHTML(doctor, NameN) {
  // Tạo HTML cho bác sĩ dựa trên dữ liệu
  const { NameBS, Decription, IDN } = doctor;
  return `
<div class="col-lg-6">
  <div class="member d-flex align-items-start">
    <div class="pic"><img src="assets/img/doctors/doctors-1.jpg" class="img-fluid" alt=""></div>
    <div class="member-info">
      <h4>${NameBS}</h4>
      <span>Chuyên khoa ${NameN}</span>
      <p>${Decription}</p>
      <div class="social">
        <a href=""><i class="ri-twitter-fill"></i></a>
        <a href=""><i class="ri-facebook-fill"></i></a>
        <a href=""><i class="ri-instagram-fill"></i></a>
        <a href=""> <i class="ri-linkedin-box-fill"></i> </a>
      </div>
    </div>
  </div>
</div>
`;
}
/////////Load page info doctor////////////////////////////////////////////////////////////
function goToDoctorDetailPage(IDBS, NameN) {
  const url = `infodoctor.html?id=${IDBS}&name=${NameN}`;
  window.location.href = url;
}
//////////Run when load page////////////////////////////////////////////////////
fetchDepartmentFromFirebase((data) => {
  showDepartment(data);
});
fetchDoctorFromFirebase((data) => {
  // getAllDoctor(data);
  fetchDataAndDisplayPage(currentPage, data);
})

/////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  renderContent()
  ///////////////// All doctor////////////////////////////////////////
  const all = document.getElementById('All');
  all.addEventListener("click", function (event) {
    const allItems = document.querySelectorAll('#khoa-list li');
    allItems.forEach(item => {
      item.classList.remove('show');
    });
    all.classList.add("show");
    fetchDoctorFromFirebase((data) => {
      getAllDoctor(data)
      fetchDataAndDisplayPage(currentPage, data);
    })
  })
  ////////////////////////// Search box////////////////////////////////////////
  document.getElementById('search-box').addEventListener("input", function (event) {
    const searchTerm = event.target.value.toLowerCase();
    const allPageItems = document.querySelectorAll('#khoa-list li');
    allPageItems.forEach(item => {
      item.classList.remove('show');
      if (item.textContent == "All") {
        item.classList.add('show');
      };
    });
    fetchDoctorFromFirebase((data) => {
      searchDoctorByName(searchTerm, data);
      fetchDataAndDisplayPageSearch(currentPageSearch, data, searchTerm);
    })

  })
})
//////// render header và footer//////////////////
function renderContent() {
  const newheader = `<div id="topbar" class="d-flex align-items-center fixed-top">
  <div class="container d-flex justify-content-between">
    <div class="contact-info d-flex align-items-center">
      <i class="bi bi-envelope"></i> <a href="mailto:contact@example.com">DoAnChuyenNganh@gmail.com</a>
      <i class="bi bi-phone"></i> 0922123123
    </div>
    <div class="d-none d-lg-flex social-links align-items-center">
      <a href="#" class="twitter"><i class="bi bi-twitter"></i></a>
      <a href="#" class="facebook"><i class="bi bi-facebook"></i></a>
      <a href="#" class="instagram"><i class="bi bi-instagram"></i></a>
      <a href="#" class="linkedin"><i class="bi bi-linkedin"></i></i></a>
    </div>
  </div>
</div>

<!-- ======= Header ======= -->
<header id="header" class="fixed-top">
  <div class="container d-flex align-items-center">
    <div class="header-left">

    </div>
    <h1 class="logo me-auto"><a href="index.html">TicaCare</a></h1>

    <nav id="navbar" class="navbar order-last order-lg-0">
      <ul>
        <li><a class="nav-link scrollto active" href="#hero">Home</a></li>
        <li><a class="nav-link scrollto" href="#about">About</a></li>
        <li><a class="nav-link scrollto" href="#services">Services</a></li>
        <li><a class="nav-link scrollto" href="#departments">Departments</a></li>
        <li><a class="nav-link scrollto" href="#doctors">Doctors</a></li>
        <li class="dropdown"><a href="#"><span>Tools</span> <i class="bi bi-chevron-down"></i></a>
          <ul>
            <li><a href="post.html">Tin tức</a></li>
            <li class="dropdown"><a href="#"><span>Chăm sóc sức khỏe</span> <i class="bi bi-chevron-right"></i></a>
              <ul>
                <li><a href="chuandoanbenhtim.html">Kiểm tra tim mạch</a></li>
                <li><a href="water-drinking.html">Quản lý lượng nước uống</a></li>
                <li><a href="calorie.html">Tính toán calories cần thiết</a></li>
                <li><a href="trainning.html">Gợi ý tập luyện</a></li>
                <li><a href="bmi.html">Tính BMI</a></li>
              </ul>
            </li>
            <li><a href="tips.html">Tips</a></li>
            <li><a href="covid_section.html">Covid</a></li>
          </ul>
        </li>
        <li><a class="nav-link scrollto" href="#contact">Contact</a></li>
      </ul>
      <i class="bi bi-list mobile-nav-toggle"></i>
    </nav><!-- .navbar -->

   
    <a href="#appointment" class="appointment-btn scrollto" id="appointment_btn" style="display: none;"><span class="d-none d-md-inline">Make an</span>
      Appointment</a>

    <div class="header__has__login" style="display: flex;" id="hasLogin">
      <a href="login.html" class="appointment-btn scrollto"><span class="d-none d-md-inline">Login</a>
    </div>
  </div>

</header><!-- End Header -->`

  const newfooter = `<footer id="footer">

  <div class="footer-top">
    <div class="container">
      <div class="row">

        <div class="col-lg-3 col-md-6 footer-contact">
          <h3>TicaCare</h3>
          <p>
            273 An Dương Vương <br>
            Phường 3, Quận 5<br>
            Việt Nam <br><br>
            <strong>Phone:</strong> +84 0922 123 123<br>
            <strong>Email:</strong> DoAnChuyenNganh@gmail.com<br>
          </p>
        </div>

        <div class="col-lg-2 col-md-6 footer-links">
          <h4>Useful Links</h4>
          <ul>
            <li><i class="bx bx-chevron-right"></i> <a href="#">Home</a></li>
            <li><i class="bx bx-chevron-right"></i> <a href="#">About us</a></li>
            <li><i class="bx bx-chevron-right"></i> <a href="#">Services</a></li>
            <li><i class="bx bx-chevron-right"></i> <a href="#">Terms of service</a></li>
            <li><i class="bx bx-chevron-right"></i> <a href="#">Privacy policy</a></li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6 footer-links">
          <h4>Our Services</h4>
          <ul>
            <li><i class="bx bx-chevron-right"></i> <a href="#services">Chăm sóc sức khỏe</a></li>
            <li><i class="bx bx-chevron-right"></i> <a href="#services">Đơn thuốc</a></li>
            <li><i class="bx bx-chevron-right"></i> <a href="#services">Tư vấn khám bệnh</a></li>
            <li><i class="bx bx-chevron-right"></i> <a href="#services">Xét nghiệm</a></li>
            <li><i class="bx bx-chevron-right"></i> <a href="#services">Hỗ trợ</a></li>
            <li><i class="bx bx-chevron-right"></i> <a href="#services">Cấp cứu 24/7</a></li>
          </ul>
        </div>

        <div class="col-lg-4 col-md-6 footer-newsletter">
          <h4>Join Our Newsletter</h4>
          <p>Hãy tham gia cùng chúng tôi nhé</p>
          <form action="" method="post">
            <input type="email" name="email"><input type="submit" value="Subscribe">
          </form>
        </div>

      </div>
    </div>
  </div>

  <div class="container d-md-flex py-4">

    <div class="me-md-auto text-center text-md-start">
      <div class="copyright">
        &copy; Copyright <strong><span>TicaCare</span></strong>. All Rights Reserved
      </div>
      <div class="credits">
        <!-- All the links in the footer should remain intact. -->
        <!-- You can delete the links only if you purchased the pro version. -->
        <!-- Licensing information: https://bootstrapmade.com/license/ -->
        <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/TicaCare-free-medical-bootstrap-theme/ -->
        Welcome to <a href="#">TicaCare</a>
      </div>
    </div>
    <div class="social-links text-center text-md-right pt-3 pt-md-0">
      <a href="#" class="twitter"><i class="bx bxl-twitter"></i></a>
      <a href="#" class="facebook"><i class="bx bxl-facebook"></i></a>
      <a href="#" class="instagram"><i class="bx bxl-instagram"></i></a>
      <a href="#" class="google-plus"><i class="bx bxl-skype"></i></a>
      <a href="#" class="linkedin"><i class="bx bxl-linkedin"></i></a>
    </div>
  </div>
</footer><!-- End Footer -->

  `

  document.getElementById('insert-header').innerHTML = newheader;
  document.getElementById('insert-footer').innerHTML = newfooter;
  displayAdminName();
  displayUserName();
}
///////////////////////Phân trang////////////////////////////////////////////////////////////////
const itemsPerPage = 5;
let currentPage = 1;
let currentPageChild = 1;
let currentPageSearch = 1;
///////////////////////////////////////////////////////////////////////
function fetchDataAndDisplayPage(page, data) {
  const doctorList = document.getElementById('doctor-list');
  const pagination = document.getElementById('pagination');
  const dbRef1 = ref(database, 'department/');
  // Lấy tất cả người dùng
  const users = Object.values(data);
  // Tính toán chỉ mục bắt đầu và chỉ mục kết thúc của trang
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Hiển thị người dùng trên trang hiện tại
  const usersOnPage = users.slice(startIndex, endIndex);
  doctorList.innerHTML = '';
  for (const user of usersOnPage) {
    onValue(dbRef1, (snapshot1) => {
      snapshot1.forEach((childSnapshot1) => {
        const childData1 = childSnapshot1.val();
        if (user.IDN == childData1.IDN) {
          const NameN = childData1.NameN;
          const userButton = createDoctorButton(user, user.IDBS, NameN);
          doctorList.appendChild(userButton);
        }
      })
    })
  }
  // Hiển thị phân trang
  const totalPages = Math.ceil(users.length / itemsPerPage);
  pagination.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement('li');
    pageItem.textContent = i;
    pageItem.addEventListener('click', () => {
      currentPage = i;
      fetchDataAndDisplayPage(currentPage, data);
      const allPageItems = pagination.querySelectorAll('#pagination li');
      allPageItems.forEach(item => {
        if (item.textContent == i) {
          item.classList.add('page-act');
        };
      });
    });

    pagination.appendChild(pageItem);
  }

}
function fetchDataAndDisplayPageChild(page, data, IDN) {
  const doctorList = document.getElementById('doctor-list');
  const paginationChild = document.getElementById('pagination');

  const dbRef1 = ref(database, 'department/');
  // Lấy tất cả người dùng
  const users = Object.values(data).filter((doctor) => doctor.IDN === IDN);
  // Tính toán chỉ mục bắt đầu và chỉ mục kết thúc của trang
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Hiển thị người dùng trên trang hiện tại
  const usersOnPage = users.slice(startIndex, endIndex);
  doctorList.innerHTML = '';
  for (const user of usersOnPage) {
    onValue(dbRef1, (snapshot1) => {
      snapshot1.forEach((childSnapshot1) => {
        const childData1 = childSnapshot1.val();
        if (user.IDN == childData1.IDN) {
          const NameN = childData1.NameN;
          const userButton = createDoctorButton(user, user.IDBS, NameN);
          doctorList.appendChild(userButton);
        }
      })
    })
  }
  // Hiển thị phân trang
  const totalPages = Math.ceil(users.length / itemsPerPage);
  paginationChild.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement('li');
    pageItem.textContent = i;
    pageItem.addEventListener('click', () => {
      currentPageChild = i;
      fetchDataAndDisplayPageChild(currentPageChild, data, IDN);
      const allPageItems = paginationChild.querySelectorAll('#pagination li');
      allPageItems.forEach(item => {
        if (item.textContent == i) {
          item.classList.add('page-act');
        };
      });

    });

    paginationChild.appendChild(pageItem);
  }
}
function fetchDataAndDisplayPageSearch(page, data, name) {
  const doctorList = document.getElementById('doctor-list');
  const paginationSearch = document.getElementById('pagination');
  const dbRef1 = ref(database, 'department/');
  // Lấy tất cả người dùng
  const users = Object.values(data).filter((doctor) => doctor.NameBS.toLowerCase().indexOf(name) > -1);
  console.log(users);
  // Tính toán chỉ mục bắt đầu và chỉ mục kết thúc của trang
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Hiển thị người dùng trên trang hiện tại
  const usersOnPage = users.slice(startIndex, endIndex);
  doctorList.innerHTML = '';
  for (const user of usersOnPage) {
    onValue(dbRef1, (snapshot1) => {
      snapshot1.forEach((childSnapshot1) => {
        const childData1 = childSnapshot1.val();
        if (user.IDN == childData1.IDN) {
          const NameN = childData1.NameN;
          const userButton = createDoctorButton(user, user.IDBS, NameN);
          doctorList.appendChild(userButton);
        }
      })
    })
  }
  // Hiển thị phân trang
  const totalPages = Math.ceil(users.length / itemsPerPage);
  paginationSearch.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement('li');
    pageItem.textContent = i;
    pageItem.addEventListener('click', () => {
      currentPageSearch = i;
      fetchDataAndDisplayPageSearch(currentPageSearch, data, name);
      const allPageItems = paginationSearch.querySelectorAll('#pagination li');
      allPageItems.forEach(item => {
        if (item.textContent == i) {
          item.classList.add('page-act');
        };
      });

    });
    paginationSearch.appendChild(pageItem);
  }
}

// Trong trang bảo mật (index.html)
function displayUserName() {
  const hasLoginElement = document.getElementById("hasLogin");
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';


  if (isLoggedIn) {
    const loggedInUserString = localStorage.getItem('loggedInUser');
    const loggedInDoctorString = localStorage.getItem('loggedInDoctor');
    if (loggedInUserString) {
      const loggedInUser = JSON.parse(loggedInUserString);
      const loggedInUserName = loggedInUser.name;
      const data = `
          <img src="./assets/img/shizuka.jpg" alt="">
          <span id="userLogin">${loggedInUserName}</span>
          <ul class="has__login-list">
            <li class="has__login-item" id="admin"><a href="infoUser.html" id="info-user">Thay đổi thông tin</a></li>
            <li class="has__login-item"><a id="logout" onclick="logoutUser();">Đăng xuất</a></li>
          </ul>
        `;
      hasLoginElement.innerHTML = data;
      // document.getElementById("appointment").style.display = "block";
      // document.getElementById("appointment_btn").style.display = "block";
      document.getElementById("logout").addEventListener("click", logoutUser);
    } else if (loggedInDoctorString) {
      const loggedInDoctor = JSON.parse(loggedInDoctorString);
      const loggedInDoctorName = loggedInDoctor.name;
      const data = `
         <img src="./assets/img/shizuka.jpg" alt="">
         <span id="userLogin">${loggedInDoctorName}</span>
         <ul class="has__login-list">
            <li class="has__login-item" id="admin"><a href="MedicalRecord.html" id="info-user">Hồ sơ bệnh án</a></li>
            <li class="has__login-item" id="admin"><a href="Date.html" id="Date">Xem lịch hẹn</a></li>
            <li class="has__login-item"><a id="logout" onclick="logoutUser();">Đăng xuất</a></li>
         </ul>
       `;
      hasLoginElement.innerHTML = data;
      document.getElementById("logout").addEventListener("click", logoutUser);
    }
  }
}



function displayAdminName() {
  const hasLoginElement = document.getElementById("hasLogin");
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (isLoggedIn) {
    const loggedInUserString = localStorage.getItem('loggedInUserAdmin');
    if (loggedInUserString) {
      const loggedInUser = JSON.parse(loggedInUserString);
      const loggedInUserName = loggedInUser.name;
      const data = `
         <img src="./assets/img/shizuka.jpg" alt="">
         <span id="userLogin">${loggedInUserName}</span>
         <ul class="has__login-list">
         <li class="has__login-item" id="admin" ><a href="" id="permission_account" style="display: block;">Phân quyền</a></li>
           <li class="has__login-item"><a id="logout" onclick="logoutUser();">Đăng xuất</a></li>
         </ul>
       `;
      hasLoginElement.innerHTML = data;
      document.getElementById("appointment").style.display = "block";
      document.getElementById("appointment_btn").style.display = "block";
      document.getElementById("logout").addEventListener("click", logoutUser);
    }
  }
}

function logoutUser() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('loggedInDoctor');
  localStorage.removeItem('loggedInUserAdmin');
  localStorage.removeItem('isLoggedIn');
  window.location.href = "index.html";
}