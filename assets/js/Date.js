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

const loggedInDoctorString = localStorage.getItem('loggedInDoctor');
const loggedInDoctorID = JSON.parse(loggedInDoctorString).id;
const DateDetail = document.getElementById("container-form");
const chuaco = document.getElementById("chuaco");
const daco = document.getElementById("daco");

///// 2 button chua co don thuoc & da co don thuoc
chuaco.addEventListener("click", () => {
    chuaco.classList.add("active");
    daco.classList.remove("active");
    document.getElementById("Date").innerHTML = "";
    fetchDateFromFirebase((data) => {
        displayDate(data);
        document.getElementById("Datehandle").style.display = "block";
    });
})
daco.addEventListener("click", () => {
    daco.classList.add("active");
    chuaco.classList.remove("active");
    document.getElementById("Date").innerHTML = "";
    fetchDateFromFirebase((data) => {
        displayDate(data, 1);
        document.getElementById("Datehandle").style.display = "none";
    });
})
// Hàm để lấy dữ liệu bác sĩ từ Firebase
function fetchDTFromFirebase(callback) {
    const dbRef = ref(connectDB, 'doctors/'); // Thay 'doctors' bằng đường dẫn thực của bạn
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
}
function fetchDateFromFirebase(callback) {
    const dbRef = ref(connectDB, 'appointment/'); // Thay 'doctors' bằng đường dẫn thực của bạn
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
}
function fetchKHFromFirebase(callback) {
    const dbRef = ref(connectDB, 'account/'); // Thay 'doctors' bằng đường dẫn thực của bạn
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
}
function fetchNFromFirebase(callback) {
    const dbRef = ref(connectDB, 'department/'); // Thay 'doctors' bằng đường dẫn thực của bạn
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
              `
        if (datas !== null) {
            datas.innerHTML = detailUser;
        }
    }
}
// Hàm để hiển thị dữ liệu lịch hẹn
function displayDate(data, status) {
    const Datelist = document.getElementById("Date");
    const Dates = Object.values(data).filter((Date) => Date.IDBS === loggedInDoctorID && Date.Status == status);
    for (const childDt of Dates) {
        const Datebutton = document.createElement('li');
        const data = `
          ID: ${childDt.IDTK} | Lời nhắn: ${childDt.message} | Thời gian hẹn: ${childDt.Date}
          
          `;
        Datebutton.innerHTML = data;
        Datelist.appendChild(Datebutton);
        Datebutton.addEventListener('click', () => {
            document.getElementById("overlay").style.display = "block";
            fetchKHFromFirebase((data) => {
                fetchDTFromFirebase((data1) => {
                    fetchNFromFirebase((data2) => {
                        if (childDt.Status) {
                            const status = "Đã xử lý";
                            displayInfoDate(childDt.IDTK, childDt.IDN, childDt.message, childDt.Date, status, data, data1, data2);
                        }
                        else {
                            const status = "chưa xử lý";
                            displayInfoDate(childDt.IDTK, childDt.IDN, childDt.message, childDt.Date, status, data, data1, data2);
                            const IDAP = {
                                IDAP: childDt.IDAP
                            }
                            localStorage.setItem('IDAP', JSON.stringify(IDAP));
                        }
                    });
                });
            });

        })
    }
}

document.getElementById("Datehandle").addEventListener("click", () => {
    var IDAP = JSON.parse(localStorage.getItem('IDAP')).IDAP;
    updateStatus(IDAP);
    document.getElementById("overlay").style.display = "none";
});
/////Hàm update trạng thái
function updateStatus(idAppoint) {
    const appoint = ref(connectDB, 'appointment/' + idAppoint);
    get(appoint)
        .then((snapshot) => {
            const currentData = snapshot.val();
            // Cập nhật chỉ trường Bool và giữ nguyên các trường khác
            const newData = { ...currentData, Status: 1 };
            // Thực hiện cập nhật
            update(appoint, newData)
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
        })
        .catch((error) => {
            console.error("Lỗi truy cập dữ liệu:", error);
        });
}
// Hàm để hiển thị dữ liệu lịch hẹn
function displayInfoDate(IDTK, IDN, message, time, status, data, data1, data2) {
    const accounts = Object.values(data).filter((account) => account.IDTK === IDTK);
    const infodoctors = Object.values(data1).filter((doctor) => doctor.IDBS === loggedInDoctorID);
    const departs = Object.values(data2).filter((depart) => depart.IDN === IDN);
    console.log(IDN)
    for (const childData of accounts) {
        for (const childDatas of departs) {
            for (const childDatass of infodoctors) {
                const data = `
        <div class="row">
        <div class="form-group col-12 col-sm-6">
            <label for="">Bác sĩ: ${childDatass.NameBS}</label>
        </div>
        <div class="form-group col-12 col-sm-6">
            <label for="">Bệnh nhân: ${childData.NameKH}</label>
        </div>
    </div>
    <div class="form-group">
        <label for="">Khoa khám : ${childDatas.NameN}</label>

    </div>
    <div class="form-group">
        <label for="">Lời nhắn: ${message}</label>

    </div>
    <div class="form-group">
        <label for="">Thời gian hẹn: ${time}</label>

    </div>
    <div class="form-group">
        <label for="">Trạng thái: ${status}</label>

    </div>`
                DateDetail.innerHTML = data;

            }
        }

    }


}
/////////////////////////////////////////////////////////////////////////////
document.getElementById("closeButton").addEventListener("click", function () {
    document.getElementById("overlay").style.display = "none";
});
document.getElementById("overlay").addEventListener("click", function (e) {
    if (e.target === document.getElementById("overlay")) {
        document.getElementById("overlay").style.display = "none";
    }
});
////////////////////////////////////////////////////////////////////////////////
fetchDTFromFirebase((data) => {
    dataToStorage(data);
});
fetchDateFromFirebase((data) => {
    displayDate(data);
    document.getElementById("Datehandle").style.display = "block";
});