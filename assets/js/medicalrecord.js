// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue, limitToLast, query, update } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
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

// Các biến toàn cục khác
const loggedInDoctorString = localStorage.getItem('loggedInDoctor');
let record = JSON.parse(localStorage.getItem('Medicine_record'))
const loggedInDoctorID = JSON.parse(loggedInDoctorString).id;
const medicineInfo = document.getElementById("container-form");
const overlay = document.getElementById("overlay");
const medSup = document.getElementById("mediSup");
const medicineDataArray = [];
let next;
var newIDDT;
var newIDHSB;
const chuaco = document.getElementById("chuaco");
const daco = document.getElementById("daco");

///// 2 button chua co don thuoc & da co don thuoc
chuaco.addEventListener("click", () => {
    chuaco.classList.add("active");
    daco.classList.remove("active");
    document.getElementById("medicalrecords").innerHTML = "";
    fetchHSBFromFirebase((data) => {
        displayMedicalrecords(data, 0);
    });
})
daco.addEventListener("click", () => {
    daco.classList.add("active");
    chuaco.classList.remove("active");
    document.getElementById("medicalrecords").innerHTML = "";
    fetchHSBFromFirebase((data) => {
        displayMedicalrecords(data, 1);
    });
})

// Hàm để lấy dữ liệu tài khoản từ Firebase
function fetchKHFromFirebase(callback) {
    const dbRef = ref(connectDB, 'account/'); // Thay 'doctors' bằng đường dẫn thực của bạn
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
}
// Hàm để lấy dữ liệu bác sĩ từ Firebase
function fetchDTFromFirebase(callback) {
    const dbRef = ref(connectDB, 'doctors/'); // Thay 'doctors' bằng đường dẫn thực của bạn
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
}
// Hàm để lấy dữ liệu hồ sơ y tế từ Firebase
function fetchHSBFromFirebase(callback) {
    const dbRef = ref(connectDB, 'medicalrecord/'); // Thay 'doctors' bằng đường dẫn thực của bạn
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
}
// Hàm để hiển thị dữ liệu bác sĩ
function dataToStorage(data) {
    var datas = document.getElementById('infoDoctor');
    const infodoctors = Object.values(data).filter((doctor) => doctor.IDBS === loggedInDoctorID);
    for (const childData of infodoctors) {
        const detailUser = `
              <h2>${childData.NameBS}</h2>
              <div class="userInfo">
                  <div>ID:${childData.IDBS}</div>
                  <div>Tuổi: ${childData.AgeBS}</div>
                    
                  <div>Số điện thoại: +84 ${childData.PhoneBS}</div>
                  <div>Giới tính: ${childData.Sex}</div>
              </div>
              <div class="updateUser">
                   
                  <button class="updatePass" type="button" onclick="togglePass()">Tạo hồ sơ bệnh án</button>
              </div>`;
        if (datas !== null) {
            datas.innerHTML = detailUser;
        }
    }
}
// Hàm để hiển thị hồ sơ y tế
function displayMedicalrecords(data, bool) {
    const HSBlist = document.getElementById("medicalrecords");
    const infoHSBs = Object.values(data).filter((infoHSB) => infoHSB.IDBS === loggedInDoctorID && infoHSB.Bool === bool);
    for (const childDt of infoHSBs) {
        const HSBbutton = document.createElement('li');
        const data = `
          ID: ${childDt.IDTK} | Loại bệnh: ${childDt.Info} | thời gian tạo: ${childDt.Time}
          
          `;
        HSBbutton.innerHTML = data;
        HSBlist.appendChild(HSBbutton);
        /// Xử lý sự kiện click khi nhấn vào HSB
        HSBbutton.addEventListener('click', () => {
            document.getElementById("container-form").innerHTML = '';
            const IDTK = {
                IDTK: childDt.IDTK,
                IDHSB: childDt.IDHSB,
                email: ""
            }
            localStorage.setItem('IDTK', JSON.stringify(IDTK));
            fetchKHFromFirebase((data) => {
                fetchHSBFromFirebase((data2) => {
                    if(bool === 0){
                        overlay.style.display = "block";
                        displayMedicine(childDt.IDTK, data, data2);
                    }
                    else{
                        overlay.style.display = "none";
                    }
                });

            });
            event.preventDefault(); // Sử dụng event.preventDefault()
            return false;
        })
    }
}
///Xử lý click đóng form đơn thuốc
document.getElementById("closeButton").addEventListener("click", function () {
    overlay.style.display = "none";
    localStorage.removeItem('Medicine_record');
    localStorage.removeItem('HSB');
});
///Xử lý click ngoài đơn thuốc
overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
        overlay.style.display = "none";
    }
});
// Hàm để hiển thị chi tiết đơn thuốc
function displayMedicine(IDTK, data, data2) {
    const accounts = Object.values(data).filter((account) => account.IDTK === IDTK);
    const infoTKs = Object.values(data2).filter((infoTK) => infoTK.IDTK === IDTK);
    for (const childDt of infoTKs) {
        for (const childData of accounts) {
            let existingData = localStorage.getItem('IDTK');
            existingData = JSON.parse(existingData) || {};
            existingData.email = childData.Email;
            localStorage.setItem('IDTK', JSON.stringify(existingData));
            const data = `
        <div class="row">
        <div class="form-group col-12 col-sm-6">
            <label for="">Bác sĩ: ${loggedInDoctorID}</label>
        </div>
        <div class="form-group col-12 col-sm-6">
            <label for="">ID Bệnh nhân: ${childDt.IDTK}</label>
        </div>
    </div>
    <div class="form-group">
        <label for="">Tên Bệnh Nhân: ${childData.NameKH}</label>

    </div>
    <div class="form-group">
        <label for="">Chẩn đoán:${childDt.PatientCondition}</label>

    </div>
    <div class="form-group birth">
        <label for="">Toa thuốc:</label>
        <input type="button" name="" id="addMedicine" value="Thêm">
    </div>
    <ul id="drug_list">
        <li>
            <div>
                <span>1.Thuốc: 
                <input type="text" id="medicineName1">
                </span>
                <span>Ngày uống: <select class="timesSelect1"></select>
                <span>lần</span><span>Mỗi lần: <select class="pillSelect1"></select><span>viên</span></span></span>
                
                <span>Ghi chú: <input type="text" id="note1"></span>
            </div>
        </li>
        <li>
            <div>
                <span>2.Thuốc: 
                <input type="text" id="medicineName2">
                </span>
                <span>Ngày uống: <select class="timesSelect2"></select><span>lần</span><span>Mỗi lần: <select class="pillSelect2"></select><span>viên</span></span></span>
                
                <span>Ghi chú: <input type="text" id="note2"></span>
            </div>
        </li>
        <li>
            <div>
                <span>3.Thuốc: 
                <input type="text" id="medicineName3">
                </span>
                <span>Ngày uống: <select class="timesSelect3"></select><span>lần</span><span>Mỗi lần: <select class="pillSelect3"></select><span>viên</span></span></span>
                
                <span>Ghi chú: <input type="text" id="note3"></span>
            </div>
        </li>
    </ul>
      `;
            medicineInfo.innerHTML = data;
            addMedicine();
            for (var i = 1; i <= 3; i++) {
                addOption('timesSelect' + i);
                addOption('pillSelect' + i);
            }
        }
    }
}
///Hàm thêm thuốc mới
function addMedicine() {
    next = 3;
    document.getElementById("addMedicine").addEventListener("click", function (e) {
        next = next + 1;
        const Medicinbutton = document.createElement('li');
        const data = `<div>
                          <span>${next}.Thuốc: 
                          <input type="text" id="medicineName${next}"></span>
                          <span>Ngày uống: <select class="timesSelect${next}"></select><span>lần</span><span>Mỗi lần: <select class="pillSelect${next}"></select><span>viên</span></span></span>
                          
                          <span>Ghi chú: <input type="text" id="note${next}"></span>
                      </div>`
        Medicinbutton.innerHTML = data;
        document.getElementById("drug_list").appendChild(Medicinbutton);
        addOption('timesSelect' + next);
        addOption('pillSelect' + next);
    })
}
///// Hàm thêm lựa chọn
function addOption(classname) {
    var selectElements = document.querySelectorAll('.' + classname);
    // Thêm các option từ 1 đến 10
    for (var i = 1; i <= 10; i++) {
        selectElements.forEach(function (select) {
            var option = document.createElement('option');
            option.value = i;
            option.text = i;
            select.add(option);
        })
    }
}
////Hàm thêm lựa chọn khách hàng
function addOptionKH(data) {
    var selectElement = document.getElementById("id_user");
    selectElement.innerHTML = "";
    const accounts = Object.values(data);
    for (const childData of accounts) {
        var option = document.createElement('option');
        option.value = childData.IDTK;
        option.text = `${childData.IDTK} - ${childData.NameKH}`;
        selectElement.add(option);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetchKHFromFirebase((data) => {
        addOptionKH(data)
    });
})
////Hàm đưa đơn thuốc vô mảng
function receiveInfo(i) {
    const medicineName = document.getElementById('medicineName' + i).value;
    const times = document.querySelector('.timesSelect' + i).value;
    const pills = document.querySelector('.pillSelect' + i).value;
    const note = document.getElementById('note' + i).value;

    const medicineItem = {
        number: i,
        name: medicineName,
        times: times,
        pills: pills,
        note: note
    };
    medicineDataArray.push(medicineItem);
}
//////////Xử lý sự kiện click khi nhấn cấp thuốc
medSup.addEventListener("click", mediSupClickHandler);
var id = localStorage.getItem('IDTK');
if (id) {
    var idTK = JSON.parse(localStorage.getItem('IDTK')).IDTK;
    var idHSB = JSON.parse(localStorage.getItem('IDTK')).IDHSB;
}
function mediSupClickHandler(e) {
    for (var i = 1; i <= next; i++) {
        receiveInfo(i);
    }
    MedicineSupply(idTK, idHSB);
    const HSBRef = ref(connectDB, 'medicalrecord/' + idHSB);

    // Lấy dữ liệu hiện tại của đối tượng HSB
    get(HSBRef)
        .then((snapshot) => {
            const currentData = snapshot.val();
            // Cập nhật chỉ trường Bool và giữ nguyên các trường khác
            const newData = { ...currentData, Bool: 1 };
            // Thực hiện cập nhật
            update(HSBRef, newData)
                .then(() => {
                    console.log("Cập nhật thành công");
                })
                .catch((error) => {
                    console.error("Lỗi cập nhật:", error);
                });
        })
        .catch((error) => {
            console.error("Lỗi truy cập dữ liệu:", error);
        });
    localStorage.removeItem('DT');
    medicineDataArray.splice(0, medicineDataArray.length);
    sendEmail();
    overlay.style.display = "none";
    localStorage.removeItem('Medicine_record');
    localStorage.removeItem('HSB');
}
///////Hàm lưu toa thuốc vào firebase
function MedicineSupply(IDTK, IDHSB) {
    var currentTime = new Date();
    var formattedTime = currentTime.toLocaleString();
    const dbRef = query(ref(connectDB, 'Prescription/'), limitToLast(1));
    onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            var currentID = parseInt(splitSTringIDMR(childData.IDDT).number);
            var nextID = currentID + 1;
            newIDDT = "DT" + nextID.toString().padStart(3, "0");
            const DT = {
                IDDT: newIDDT
            }
            localStorage.setItem('DT', JSON.stringify(DT));
        })
    })
    newIDDT = JSON.parse(localStorage.getItem('DT')).IDDT;
    const detailPresObject = {};
    medicineDataArray.forEach((medication, index) => {
        detailPresObject[index + 1] = medication;
    });
    set(ref(connectDB, 'Prescription/' + newIDDT), {
        IDBS: loggedInDoctorID,
        IDDT: newIDDT,
        IDTK: IDTK,
        IDHSB: IDHSB,
        detailPres: detailPresObject,
        Time: formattedTime
    });
}
////////Hàm lưu hồ sơ bệnh vào firebase
function addMRToDatabase() {
    const IDdoctor = JSON.parse(localStorage.getItem('Medicine_record')).doctorid;
    const IDTK = JSON.parse(localStorage.getItem('Medicine_record')).userid;
    const Info = JSON.parse(localStorage.getItem('Medicine_record')).type_issue;
    const Condition = JSON.parse(localStorage.getItem('Medicine_record')).condition;
    const Time = JSON.parse(localStorage.getItem('Medicine_record')).date;
    const dbRef = query(ref(connectDB, 'medicalrecord/'), limitToLast(1));
    onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            var currentID = parseInt(splitSTringIDMR(childData.IDHSB).number);
            var nextID = currentID + 1;
            newIDHSB = "HSB" + nextID.toString().padStart(3, "0");
            const HSB = {
                IDHSB: newIDHSB
            }
            localStorage.setItem('HSB', JSON.stringify(HSB));
        })
    })
    newIDHSB = JSON.parse(localStorage.getItem('HSB')).IDHSB;
    set(ref(connectDB, 'medicalrecord/' + newIDHSB), {
        IDBS: IDdoctor,
        IDHSB: newIDHSB,
        IDTK: IDTK,
        Info: Info,
        PatientCondition: Condition,
        Time: Time,
        Bool: 0,
    });
}
//////Hàm tách chuỗi ID
function splitSTringIDMR(ID) {
    var input = ID;
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
////////check xem có dữ liệu chưa
if (record) {
    addMRToDatabase()
    localStorage.removeItem('Medicine_record');
    localStorage.removeItem('HSB');
}
/////////cái này với cái trên giống nhau
window.addEventListener('storage', handleStorageChange);
function handleStorageChange(event) {
    if (event.key === 'Medicine_record') {
        if (record) {
            addMRToDatabase()
            localStorage.removeItem('Medicine_record');
            localStorage.removeItem('HSB');
        }
    }
}
/// Khởi động khi load trang
window.onload = () => {
    fetchDTFromFirebase((data) => {
        dataToStorage(data);
    });
    fetchHSBFromFirebase((data) => {
        displayMedicalrecords(data, 0);
    });
};
/// Hàm gửi email sau khi đã có đơn thuốc
function sendEmail() {
    (function () {
        emailjs.init("l2Wrfi9WRROahX1Hl");
    })();
    let email = JSON.parse(localStorage.getItem('IDTK')).email
    var params = {
        to: email,
        subject: "Thông báo đã có thuốc",
        message: "Thuốc của bạn đã sẵn sàng. Vui lòng click vào đường link bên dưới hoặc truy cập vào website để nhận đơn thuốc của bạn" + "Link: "
    }
    var serviceID = "service_vc8ezhs";
    var templateID = "template_11sk76e";
    emailjs.send(serviceID, templateID, params)
        .then(res => {
            alert("Đã gửi email nhắc nhở")
        })
        .catch(err => {
            alert("Gửi email nhắc nhở thất bại")
        })
}

