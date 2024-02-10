
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, push, ref, set, get, child, onValue, limitToLast, query, update, orderByChild } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
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

function dataToStorage() {
    var departmentSelect = document.getElementById("department");
var doctorSelect = document.getElementById("doctor");

// Lắng nghe sự kiện "change" trên phần tử departmentSelect
departmentSelect.addEventListener("change", function() {
    var selectedDepartmentID = departmentSelect.value;

    // Xóa danh sách bác sĩ hiện tại
    doctorSelect.innerHTML = "";

    // Thêm một lựa chọn mặc định
    var defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Doctor";
    doctorSelect.appendChild(defaultOption);

    // Lấy danh sách bác sĩ của bộ phận được chọn
    var doctorRef = ref(connectDB, "doctors/");
    onValue(doctorRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            var doctor = childSnapshot.val();
            if (doctor.IDN === selectedDepartmentID) {
                // Nếu bác sĩ thuộc bộ phận được chọn, thêm họ vào danh sách
                var option = document.createElement("option");
                option.value = doctor.IDBS;
                option.textContent = doctor.NameBS;
                doctorSelect.appendChild(option);
            }
        });
    });
});

// Lấy tham chiếu đến danh sách bộ phận và hiển thị nó ban đầu
var departmentRef = ref(connectDB, "department/");
onValue(departmentRef, (snapshot) => {
    departmentSelect.innerHTML = ""; // Xóa tất cả các tùy chọn hiện tại

    var defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Department";
    departmentSelect.appendChild(defaultOption);

    snapshot.forEach((childSnapshot) => {
        var department = childSnapshot.val();
        var option = document.createElement("option");
        option.value = department.IDN;
        option.textContent = department.NameN;
        departmentSelect.appendChild(option);
    });
});

}
dataToStorage();




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

function addAppointment() {
    const loggedInUserString = localStorage.getItem('loggedInUser');
    const loggedInUser = JSON.parse(loggedInUserString);
    if (!loggedInUser) {
        swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Bạn chưa đăng nhập.'
        });
        return;
    }

    const IDTK = loggedInUser.id;
    const date = document.getElementById('date').value;
    const department = document.getElementById('department').value;
    const doctor = document.getElementById('doctor').value;
    const message = document.getElementById('message_apointment').value;

    if (!date.trim() || !department.trim() || !doctor.trim()) {
        swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Vui lòng điền đầy đủ thông tin cuộc hẹn.'
        });
        return;
    }
    const timestamp = new Date().getTime(); // Lấy thời gian hiện tại dưới dạng timestamp
    const newID = "AP" + timestamp;

    const newAppointment = {
        IDAP: newID,
        IDTK: IDTK,
        Date: date,
        IDN: department,
        IDBS: doctor,
        message: message
    };

    // Tạo tham chiếu đến Firebase Realtime Database
    const appointmentRef = ref(connectDB, 'appointment/' + newID);

    // Sử dụng phương thức set để thêm cuộc hẹn vào 'appointment' với khóa 'newID'
    set(appointmentRef, newAppointment)
    .then(() => {
        // Reset the fields to empty strings after a successful appointment is added
        document.getElementById('date').value = "";
        document.getElementById('department').value = "";
        document.getElementById('doctor').value = "";
        document.getElementById('message_apointment').value = "";

        swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Thêm cuộc hẹn thành công.'
        });
    })
    .catch(error => {
        swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Xảy ra lỗi khi thêm cuộc hẹn vào appointment: ' + error.message
        });
    });
}

document.getElementById('submit_appointment').addEventListener('click', addAppointment);


