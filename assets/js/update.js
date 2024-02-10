
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue, limitToLast, query,update } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const connectDB = getDatabase(app);

const loggedInUserString = localStorage.getItem('loggedInUser');
const loggedInUserID = JSON.parse(loggedInUserString).id;

function dataToStorage() {
  var data = document.getElementById('infoUser');
  const dbRef = ref(connectDB, 'account/');
  onValue(dbRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      if (childData.IDTK == loggedInUserID) {
        const detailUser = `
              <h2>${childData.NameKH}</h2>
              <div class="userInfo">
                  <div>ID:${childData.IDTK}</div>
                  <div>Tuổi: ${childData.Age}</div>
                  <div>Ngày sinh: ${childData.Birth}</div>
                  <div>Số điện thoại: +84 ${childData.PhoneKH}</div>
                  <div>Giới tính: ${childData.Sex}</div>
              </div>
              <div class="updateUser">
                  <button class="updateInfo" id="updateInfo" type="button" >Sửa thông tin</button>
                  <button class="updatePass" id="changePass" type="button" ">Đổi mật khẩu</button>
              </div>`;
        
        if (data !== null) {
          data.innerHTML = detailUser;
          document.getElementById('updateInfo').addEventListener('click', ()=>{
            document.getElementById("overlayForm").style.display = "block";
            getDataUpdate()
          })
          document.getElementById('changePass').addEventListener('click', ()=>{
            document.getElementById("overlayPassForm").style.display = "block";
            
          })
        }
      }

    })

  })

}


function getDataUpdate() {
  var data = document.getElementById('infoUser');
  const dbRef = ref(connectDB, 'account/');
  onValue(dbRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();

      if (childData.IDTK == loggedInUserID) {
        const getData = ` 
    <div style="display: none;">
        <input type="text" id="id_kh" name="id_kh" value = "${childData.IDTK}" required>
    </div>
    <div>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" value = "${childData.NameKH}" required>
    </div>
    <div>
        <label for="date_of_birth">Date of Birth:</label>
        <input type="date" id="date_of_birth" name="date_of_birth" value = "${childData.Birth}" required>
    </div>
    <div>
        <label for="phone_number">Phone Number: (+84)</label>
        <input type="tel" id="phone_number" name="phone_number" value ="${childData.PhoneKH}" required>
    </div>
    <div>
        <label for="phone_number">Tuổi:</label>
        <input type="number" id="Age_number" name="phone_number" value = "${childData.Age}" required>
    </div>
    <div class="radio-container">
    <label for="gender">Giới tính</label>
    <select id="gender" name="gender" required>
      <option value="Nam" ${childData.Sex === "Nam" ? "selected" : ""}>Nam</option>
      <option value="Nữ" ${childData.Sex === "Nữ" ? "selected" : ""}>Nữ</option>
      <option value="Khác" ${childData.Sex === "Khác" ? "selected" : ""}>Khác</option>
    </select>
  </div>`;
        if (data !== null) {
          document.getElementById("form-updata-user").innerHTML = getData;
        }
      }

    })

  })
}



function isValidPhoneNumber(phoneNumber) {
  // Sử dụng biểu thức chính quy để kiểm tra định dạng số điện thoại ở Việt Nam
  var phonePattern = /^(0[0-9]{9})$/;
  return phonePattern.test(phoneNumber);
}


window.onload = () => {
  dataToStorage();
};


const dataToget = document.getElementById("submit-Update");

function getDatainfoUser() {
  const idUser = document.getElementById('id_kh').value;
  const nameUser = document.getElementById('name').value;
  const birthUser = document.getElementById('date_of_birth').value;
  const phoneUser = document.getElementById('phone_number').value;
  const ageUser = document.getElementById('Age_number').value;
  const genderUser = document.getElementById('gender').value;
  if (nameUser === "" || birthUser === "" || phoneUser === ""  || ageUser === "" || genderUser === "") {
    Swal.fire({
      icon: 'error',
      title: 'Cập nhật thất bại',
      text: 'Vui lòng  nhập đầy đủ thông tin.',
    });
    return;
  }else if(!isValidPhoneNumber(phoneUser)){
    Swal.fire({
      icon: 'error',
      title: 'Cập nhật thất bại',
      text: 'Phone không đúng định dạng',
    });
    return;
  }

  const updates = {
    NameKH: nameUser,
    Birth: birthUser,
    PhoneKH: phoneUser,
    Age: ageUser,
    Sex: genderUser
  };

  const userRef = ref(connectDB, 'account/' + idUser);
  update(userRef, updates)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Cập nhật thành công!',
        text: 'Bạn đã cập nhật thành công.',
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Cập nhật thất bại!',
        text: 'Bạn đã cập nhật thất bại: ' + error.message,
        confirmButtonText: 'OK'
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    });
}

dataToget.addEventListener('click', getDatainfoUser);

async function setDataPassword() {
  try {
    // Lấy các giá trị từ các trường nhập liệu
    const idUser = loggedInUserID;
    console.log(idUser);
    const oldPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const newPasswordConfirm = document.getElementById('confirm-password').value;

    // Kiểm tra input để trống và độ dài mật khẩu mới
    if (oldPassword === '' || newPassword === '' || newPasswordConfirm === '') {
      Swal.fire({
        icon: 'error',
        title: 'Cập nhật thất bại',
        text: 'Vui lòng điền đầy đủ thông tin.',
      });
      return;
    } else if (newPassword.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Cập nhật thất bại',
        text: 'Mật khẩu phải sử dụng ít nhất 6 ký tự.',
      });
      return;
    }
    const userRef = ref(connectDB, 'account/' + idUser);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const storedPassword = userData.Password; // Giả sử mật khẩu được lưu trong trường "Password" của dữ liệu người dùng
      if (storedPassword === oldPassword) {
        if (newPassword === newPasswordConfirm) {
          const updates = {
            Password: newPassword
          };
          await update(userRef, updates);
          Swal.fire({
            icon: 'success',
            title: 'Cập nhật thành công!',
            text: 'Mật khẩu đã được cập nhật thành công.',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Mật khẩu mới và xác nhận mật khẩu không trùng khớp.',
            confirmButtonText: 'OK'
          })
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Mật khẩu cũ không đúng',
          confirmButtonText: 'OK'
        })
      }
    } else {

      showErrorMessage('Tài khoản không tồn tại.');
    }
  } catch (error) {
    console.error('Lỗi khi thực hiện cập nhật mật khẩu: ', error);
    showErrorMessage('Lỗi khi cập nhật mật khẩu. Vui lòng thử lại sau.');
  }
}

function showErrorMessage(message) {
  Swal.fire({
    icon: 'error',
    title: 'Lỗi',
    text: message,
    confirmButtonText: 'OK'
  }).then((result) => {
    if (result.isConfirmed) {
      location.reload();
    }
  });
}

document.getElementById('update-password').addEventListener('click', setDataPassword)

