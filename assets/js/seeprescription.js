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

const medicineInfo = document.getElementById("container-form");
////////////////////////////////////////////////////////
chuaco.addEventListener("click", () => {
    chuaco.classList.add("active");
    daco.classList.remove("active");
    document.getElementById("medicalrecords").innerHTML = "";
    displayMedicalrecords(0);
})
daco.addEventListener("click", () => {
    daco.classList.add("active");
    chuaco.classList.remove("active");
    document.getElementById("medicalrecords").innerHTML = "";
    displayMedicalrecords(1);

})
////////////////////////////////////////////////
function displayMedicalrecords(bool) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const HSBlist = document.getElementById("medicalrecords");
    const db = ref(connectDB, 'medicalrecord/');
    onValue(db, (snap) => {
        snap.forEach((childSnap) => {
            const childDt = childSnap.val();
            const HSBbutton = document.createElement('li');
            if (childDt.IDTK === loggedInUser.id && childDt.Bool === bool) {
                const data = `
            ID: ${childDt.IDTK} | Loại bệnh: ${childDt.Info} | thời gian tạo: ${childDt.Time}
          
          `;
                HSBbutton.innerHTML = data;

                HSBlist.appendChild(HSBbutton);
                HSBbutton.addEventListener('click', () => {
                    document.getElementById("overlay").style.display = "block";
                    displayPrescription(childDt.IDHSB, childDt.PatientCondition)
                    const BS = {
                        IDBS: childDt.IDBS
                    }
                    localStorage.setItem('BS', JSON.stringify(BS));
                })
            }
        })
    })
}
////////////////////////////////////////////////////////////////////
document.getElementById("accept").addEventListener("click", () => {
    const IDBS = JSON.parse(localStorage.getItem('BS')).IDBS;
    document.getElementById("overlay").style.display = "none";
    document.getElementById("overlay1").style.display = "block";
    EvaluateDoctor(IDBS)
})
///////////////////////////////////////////////////////////////////////
function displayPrescription(IDHSB, condition) {
    const db = ref(connectDB, 'Prescription/');
    onValue(db, (snap) => {
        snap.forEach((childSnap) => {
            const childDt = childSnap.val();
            if (IDHSB === childDt.IDHSB) {
               
                const data = `
        <div class="row">
        <div class="form-group col-12 col-sm-6">
            <label for="">Bác sĩ: ${childDt.IDBS}</label>
        </div>
        <div class="form-group col-12 col-sm-6">
            <label for="">ID Bệnh nhân: ${childDt.IDTK}</label>
        </div>
    </div>
    <div class="form-group">
        <label for="">Tên Bệnh Nhân: </label>

    </div>
    <div class="form-group">
        <label for="">Triệu chứng:${condition}</label>

    </div>
    <div class="form-group birth">
        <label for="">Toa thuốc:</label>
    </div>
    <ul id="drug_list">
        
    </ul>
      `;
        medicineInfo.innerHTML = data;
        showPres(childDt.detailPres)
        }

        })
    })

}
////////////////////////////////////////////////////////////////////////////
function showPres(listAPI){
    var toathuoc = listAPI;
    toathuoc.forEach((child)=>{
        const showPresdata = document.createElement('li');
        const dataPres =`<div>
        <span>${child.number}.Thuốc: ${child.name}</span>
        <span>Ngày uống: ${child.times}
        <span>lần</span> <span>Mỗi lần: ${child.pills}<span> viên</span></span></span>
        
        <span>Ghi chú: ${child.note}
    </div>`;
    showPresdata.innerHTML = dataPres;
    document.getElementById("drug_list").appendChild(showPresdata);
    })
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
document.getElementById("closeButton1").addEventListener("click", function () {
    document.getElementById("overlay1").style.display = "none";
});
document.getElementById("overlay1").addEventListener("click", function (e) {
    if (e.target === document.getElementById("overlay1")) {
        document.getElementById("overlay1").style.display = "none";
    }
});
/////////////////////////////////////////////////////////////////////////
function EvaluateDoctor(IDBS) {
    document.getElementById('ReviewBtn').addEventListener('click', function (e) {
        submitReview(IDBS);

        document.getElementById("overlay1").style.display = "none";
        document.getElementById('doctorReviewForm').reset();
    })
}
///////////////////////////////////////////////////////////////////////////////
var newIDDG;
function submitReview(IDBS) {
    // Lấy giá trị đánh giá và đánh giá văn bản
    var rating = document.querySelector('input[name="rating"]:checked');
    var reviewText = document.getElementById('reviewText').value;
    var currentTime = new Date();
    var formattedTime = currentTime.toLocaleString();
    const IDUser = JSON.parse(localStorage.getItem('loggedInUser')).id;
    const db = ref(connectDB, 'review/');
    onValue(db, (snap) => {
        snap.forEach((childSnap) => {
            const childDt = childSnap.val();
            var currentID = parseInt(splitSTringIDMR(childDt.IDDG).number);
            var nextID = currentID + 1;
            newIDDG = "DG" + nextID.toString().padStart(3, "0");
            const DG = {
                IDDG: newIDDG
            }
            localStorage.setItem('DG', JSON.stringify(DG));
        })
    })
    newIDDG = JSON.parse(localStorage.getItem('DG')).IDDG;
    if (rating && reviewText.trim() !== '') {
        console.log('Thời gian đánh giá: ' + formattedTime);
        console.log('Đánh giá: ' + rating.value);
        console.log('Nội dung đánh giá: ' + reviewText);
        set(ref(connectDB, 'review/' + newIDDG), {
            IDBS: IDBS,
            IDDG: newIDDG,
            IDTK: IDUser,
            starCount: rating.value,
            Detail: reviewText,
            Time: formattedTime
        });
    } else {
        alert('Vui lòng chọn số sao và nhập đánh giá!');
    }
}
///////////////////////////////////////////////////////////////////////////////////
function splitSTringIDMR(IDDG) {
    var input = IDDG;
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
displayMedicalrecords(0);

