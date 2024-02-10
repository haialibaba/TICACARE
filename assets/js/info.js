
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

function loginUser() {
  var userName = document.getElementById("user-name").value;
  var userPassword = document.getElementById("user-password").value;
  const dbRef = ref(connectDB, 'account/');
  onValue(dbRef, (snapshot) => {
    let loggedIn = false; // Biến để kiểm tra xem người dùng có đăng nhập thành công không.
    
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();

      if (childData.Account == userName && childData.Password == userPassword) {

        const loggedInUser = {
          name: childData.NameKH,
          id: childData.IDTK
        };
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công!',
          text: 'Bạn đã đăng nhập thành công.',
        });
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = "index.html";
        loggedIn = true;
        document.getElementById("appointment").style.display = "block";
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại',
          text: 'Tài khoản hoặc mật khẩu không đúng hoặc bạn không có quyền truy cập.',
        });
      }
    });
   

  });
}

function loginDoctor() {
  var userName = document.getElementById("user-name").value;
  var userPassword = document.getElementById("user-password").value;
  const dbRef = ref(connectDB, 'doctors/');
  onValue(dbRef, (snapshot) => {
    let loggedIn = false; // Biến để kiểm tra xem người dùng có đăng nhập thành công không.
    
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
     
      
      if (childData.Account == userName && childData.PhoneBS == userPassword) {
        const loggedInDoctor = {
          name: childData.NameBS,
          id: childData.IDBS
        };
        localStorage.setItem('loggedInDoctor', JSON.stringify(loggedInDoctor));
        Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công!',
          text: 'Bạn đã đăng nhập thành công.',
        });

        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = "index.html";
        loggedIn = true; // Đánh dấu người dùng đã đăng nhập thành công.
        document.getElementById("appointment").style.display = "block";

      }else{
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại',
          text: 'Tài khoản hoặc mật khẩu không đúng hoặc bạn không có quyền truy cập.',
        });
      }
    });

  });
}

function checkLogin() {
  if (!loginUser()) {
    loginDoctor();
  }
}
document.getElementById("submit-login").addEventListener("click", checkLogin);


function isValidEmail(email) {
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

function isValidPhoneNumber(phoneNumber) {
  // Sử dụng biểu thức chính quy để kiểm tra định dạng số điện thoại ở Việt Nam
  var phonePattern = /^(0[0-9]{9})$/;
  return phonePattern.test(phoneNumber);
}


async function registerUser() {

  var newAccount = document.getElementById("new-user-account").value;
  var newPassword = document.getElementById("new-user-password").value;
  var newName = document.getElementById("new-user-name").value;
  var newPhone = document.getElementById("new-user-phone").value;
  var email = document.getElementById("new-user-email").value;
  var confirmPassword = document.getElementById("confirm-user-password").value;

  const accountAlreadyExists = await accountExists(newAccount);
  const emailExistsResult = await emailExist(email);
    const phoneExistsResult = await phoneExists(newPhone);

  if (accountAlreadyExists) {
    Swal.fire({
      icon: 'error',
      title: 'Đăng ký thất bại',
      text: 'Tài khoản đã tồn tại. Vui lòng chọn một tài khoản khác.',
    });
    return;
  }

  if (emailExistsResult) {
    Swal.fire({
      icon: 'error',
      title: 'Đăng ký thất bại',
      text: 'Email đã tồn tại. Vui lòng chọn một email khác.',
    });
    return;
  }

  if (phoneExistsResult) {
    Swal.fire({
      icon: 'error',
      title: 'Đăng ký thất bại',
      text: 'Phone đã tồn tại. Vui lòng chọn một số điện thoại khác.',
    });
    return;
  }

  if (newAccount === "" || newName === "" || newPhone === ""  || email === "" || newPassword === "" || confirmPassword === "") {
    Swal.fire({
      icon: 'error',
      title: 'Đăng ký thất bại',
      text: 'Vui lòng  nhập đầy đủ thông tin.',
    });
    return;
  }
  else if (newPassword !== confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Đăng ký thất bại',
      text: 'Mật khẩu nhập lại không đúng.',
    });
    return;
  }
  else if (newPassword.length < 6) {
    Swal.fire({
      icon: 'error',
      title: 'Đăng ký thất bại',
      text: 'Mật khẩu phải có ít nhất 6 ký tự.',
    });
    return;
  }else if(!isValidEmail(email)){
    Swal.fire({
      icon: 'error',
      title: 'Đăng ký thất bại',
      text: 'Email không đúng định dạng',
    });
    return;
  }else if(!isValidPhoneNumber(newPhone)){
    Swal.fire({
      icon: 'error',
      title: 'Đăng ký thất bại',
      text: 'Phone không đúng định dạng',
    });

    return;
  }
  else {
    addAccountToDatabase(newAccount, newPassword, email,newPhone,newName)
    Swal.fire({
    icon: 'success',
    title: 'Đăng ký thành công!',
    text: 'Bạn đã đăng ký thành công.',
  }).then((result) => {
    if (result.isConfirmed || result.isDismissed) {
      window.location.href = "login.html";
    }
  });

  }
}
document.getElementById("register").addEventListener("click", registerUser);


async function accountExists(account) {
  try {
    const accountRef = ref(connectDB, 'account/');
    const snapshot = await get(accountRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key].Account === account) {
          return true; 
        }
      }
    }

    return false; // Account does not exist
  } catch (error) {
    console.error("Error checking account existence:", error);
    return false;
  }
}

async function emailExist(email) {
  try {
    const accountRef = ref(connectDB, 'account/');
    const snapshot = await get(accountRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Check if any account has the specified username
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key].Email === email) {
          return true; // Account already exists
        }
      }
    }

    return false; // Account does not exist
  } catch (error) {
    console.error("Error checking account existence:", error);
    return false;
  }
}

async function phoneExists(phoneKH) {
  try {
    const accountRef = ref(connectDB, 'account/');
    const snapshot = await get(accountRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Check if any account has the specified username
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key].PhoneKH === phoneKH) {
          return true; // Account already exists
        }
      }
    }

    return false; // Account does not exist
  } catch (error) {
    console.error("Error checking account existence:", error);
    return false;
  }
}

var newID;
async function addAccountToDatabase(account, password, email, phoneKH, nameKH) {
  try {
    // Kiểm tra xem tài khoản đã tồn tại chưa
    const accountExistsResult = await accountExists(account);
    const emailExistsResult = await emailExist(email);
    const phoneExistsResult = await phoneExists(phoneKH);

    if (accountExistsResult) {
      console.error("Account already exists.");
      return;
    }

    if (emailExistsResult) {
      console.error("Email already exists.");
      return;
    }

    if (phoneExistsResult) {
      console.error("Phone already exists.");
      return;
    }
    // Nếu tài khoản không tồn tại, tiếp tục thêm mới
    const dbRef = query(ref(connectDB, 'account/'), limitToLast(1));
    const snapshot = await get(dbRef);

    let newID;
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      const currentID = parseInt(splitSTringIDAccount(childData.IDTK).number);
      const nextID = currentID + 1;
      console.log(currentID);
      newID = "TK" + nextID.toString().padStart(3, "0");
    });

    await set(ref(connectDB, 'account/' + newID), {
      Account: account,
      Email: email,
      Password: password,
      IDTK: newID,
      NameKH: nameKH,
      Age: "",
      Birth: "",
      PhoneKH: phoneKH,
      Sex: "",
    });

    console.log("Account added successfully with ID: " + newID);
  } catch (error) {
    console.error("Error adding account to database:", error);
  }

}

function splitSTringIDAccount(IDTK) {
  var input = IDTK;
  var pattern = /([A-Za-z]+)(\d+)/;

  var matches = input.match(pattern);

  if (matches) {
    var letters = matches[1];
    var number = matches[2];
    return {
      letters: letters,
      number: number
    }
  } else {
    return null;
  }
}

async function emailExists(email) {
  try {
    const accountRef = ref(connectDB, 'account/');
    const snapshot = await get(accountRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key].Email === email) {
          return true;
        }
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
}
async function getUserIdByEmail(email) {
  try {
    const accountRef = ref(connectDB, 'account/');
    const snapshot = await get(accountRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key].Email === email) {
          return data[key].IDTK; 
        }
      }
    }
    return null; // Trả về null nếu không tìm thấy email
  } catch (error) {
    console.error("Error getting user ID by email:", error);
    return null;
  }
}
async function setDataPassword(email, newPassword) {
  try {
    const idUser = await getUserIdByEmail(email);
    if (idUser) {
      const userRef = ref(connectDB, 'account/' + idUser);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
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
      }
    } else {
    }
  } catch (error) {
    console.error('Lỗi khi thực hiện cập nhật mật khẩu: ', error);
  }
}

    (function () {
      emailjs.init("6vb0XAK27kUraA-CA");
    })();
    
    function sendEmail(emailSend, pass) {
      var params = {
        to: emailSend,
        subject: "Đây là mật khẩu mới của bạn",
        reply_to: emailSend,
        message: pass,
        fromname: "namhai1617@gmail.com",
        to_name: emailSend,
      };
    
      var serviceID = "service_z18gehc";
      var templateID = "template_5el6uba";
    
      emailjs
        .send(serviceID, templateID, params)
        .then((res) => {
        })
        .catch((error) => {
          console.error("Lỗi khi gửi email:", error);
        });
    }
    
    function checkEmailAndShowMessage() {
      const emailInput = document.getElementById("txtadminuser").value;
      if (!isValidEmail(emailInput)) {
        alert("Email không đúng định dạng");
        return;
      }
      emailExists(emailInput).then((emailExistsResult) => {
        if (emailExistsResult) {
          const randomPassword = generateRandomPassword(6);
          setDataPassword(emailInput, randomPassword);
          sendEmail(emailInput, randomPassword);
        } else {
          alert("Email không tồn tại. Bạn có thể sử dụng email này.");
        }
      });
    }

// Hàm tạo mật khẩu ngẫu nhiên
function generateRandomPassword(length) {
  const characters = "0123456789";
  let randomPassword = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomPassword += characters.charAt(randomIndex);
  }
  return randomPassword;
}
document.getElementById("btnuserAdd").addEventListener("click", checkEmailAndShowMessage);

