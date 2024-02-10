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

function showNew() {
    const dbRef = ref(database, 'new/');
    onValue(dbRef, (snaphost) => {
        snaphost.forEach((childSnaphost) => {
            const childData = childSnaphost.val();
            if (childData.IDTT == 'TT006') {
                const detialnew = `
                    <div class="divrow">
                  <div class="divcol-sm-6">
                      <img class="link-icon" alt="" src="./assets/img/o.jpg" />
                  </div>
                  <div class="divcol-sm-61">
                      <div class="divpl-15">
  
                          <div class="heading-2">
                              <div class="cch-chn-phng" >
                              <p>${childData.NameTT}</p>
                              </div>
                          </div>
  
                          <div class="divmb-10">
                          <i class="fa-regular fa-calendar-days"></i>
                              <div class="div2" id="Rollbox">${childData.TimeUpdate}</div>
                          </div>
                          <div class="list-item-link">
                              <div class="sn-ph-khoa" id="Text">${childData.Tag}</div>
                          </div>
                          <div class="ptext-justify">
                              <div class="lm-m-l">
                              ${childData.Content}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          `;
                document.getElementById("newDocument").innerHTML = detialnew;
                console.log(childData.IDTT);
                document.addEventListener("click", () => {
                    loadPage('infomationNew.html', childData.IDTT);
                })
            }
        })
    })
}
showNew()

function ListNewShow() {
    const listnew = document.getElementById('listDocument');
    const dbRef = ref(database, 'new/');
    onValue(dbRef, (snapshot) => {
        listnew.innerHTML = '';
        snapshot.forEach((childSnaphost) => {
            const childData = childSnaphost.val();
            const newDiv = document.createElement("li");
            if (childData.IDN == 'N003') {
                const newPost = `
        <li>
                <div class="post-item">
                    <p class="post-thumb">
                         <img src="./assets/img/o.jpg" alt="">
                    </p>
                </div>
                <div class="post-info">
                    <p class="post-cat">${childData.NameTT} </p>
                    <div class="divmb-11">
                    <i class="fa-regular fa-calendar-days"></i>
                        <div class="div3">${childData.TimeUpdate}</div>
                    </div>
                    <div class="list-item-link1">
                        <div class="sn-ph-khoa">${childData.Tag}</div>
                    </div>
                    
            </li>
        `;
                newDiv.innerHTML = newPost;
                newDiv.addEventListener("click", () => {
                    console.log(childData.IDTT);
                    loadPage('infomationNew.html', childData.IDTT);
                })
                listnew.appendChild(newDiv);
            }
        })
    })
}
function loadPage(pageUrl, IDTT) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('data').innerHTML = this.responseText;
            displayDetailDoctor(IDTT);
        }
    };
    xhttp.open('GET', pageUrl, true);
    xhttp.send();
}

function displayDetailDoctor(IDTT) {
    const dbRef = ref(database, 'new/');
    onValue(dbRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            if (childData.IDTT == IDTT) {
                const detailDoctor = `
                <div class="main">
            <div class="content">
                <h2>${childData.NameTT}</h2>
                <div class="divmb-11">
                <i class="fa-regular fa-calendar-days"></i>
                    <div class="div3">${childData.TimeUpdate}</div>
                </div>
                <div class="content-new">
                    <p>${childData.Content}.</p>
                    <p>Anh Tiến viêm họng từ bé, amidan sưng to, thường tái phát, kèm nuốt vướng, thỉnh thoảng nghẹt mũi
                        và ho đờm. Gần đây, viêm họng nặng hơn, ngủ ngáy to ‘như tiếng sấm’, anh đến Bệnh viện Đa khoa
                        Tâm Anh TP HCM khám. Kết quả nội soi mũi họng ghi nhận viêm VA tồn dư, amidan sưng to hai bên,
                        quá phát độ ba, hốc amidan có mủ vón cục như bã đậu trên bề mặt. Vùng đáy lưỡi và thành sau họng
                        có các mô lympho quá phát.</p>
                    <p>Ngày 23/10, BS.CKII Nguyễn Như Duy, Trung tâm Tai Mũi Họng, cho biết VA phát triển từ 6 tháng
                        tuổi, tăng dần kích cỡ lúc 2-4 tuổi, bắt đầu teo dần khi trẻ hơn 7 tuổi và gần như biến mất hoàn
                        toàn khi bước vào tuổi dậy thì. Viêm VA tồn dư ở người trưởng thành chưa rõ nguyên nhân. Tuy
                        nhiên, tình trạng VA quá phát lúc nhỏ nhưng không nạo là yếu tố nguy cơ dẫn đến VA tồn dư ở tuổi
                        trưởng thành.</p>
                    <div class="image">
                        <img src="./assets/img/o.jpg">
                    </div>
                    <p>Trường hợp không có triệu chứng, hẹp hoặc hở van tim nhẹ, chưa cần phẫu thuật, theo dõi để phòng
                        bệnh tiến triển. Khi người bệnh hẹp khít van hai lá, bác sĩ xem xét nong van bằng bóng, không
                        phải phẫu thuật. Tuy nhiên, trường hợp bà Vịnh không thể nong van vì đã cao tuổi, van vôi hóa,
                        đồng thời có kèm hở van nên phương pháp điều trị duy nhất là thay van, bác sĩ Dũng nói.</p>
                </div>
            </div>
            
        </div>`;
                document.getElementById("data-news").innerHTML = detailDoctor;

            }
        })

    })
}

ListNewShow()

