document.addEventListener('DOMContentLoaded', () => {
  // Firebase config
  const firebaseConfig = {
      apiKey: "AIzaSyAEWxTJ1loQkXM1ShwAAF1J15RQLlCgdGM",
      authDomain: "msgapp-262c9.firebaseapp.com",
      projectId: "msgapp-262c9",
      storageBucket: "msgapp-262c9.firebasestorage.app",
      messagingSenderId: "122648836940",
      appId: "1:122648836940:web:a098c052f65f3eb305ade9"
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  const adminEmails = ["m10abdullah09@gmail.com"];
  
  const loginBtn = document.getElementById('adminLoginBtn');
  const loginContainer = document.getElementById('loginContainer');
  const dashboard = document.getElementById('dashboard');
  const usersContainer = document.getElementById('usersContainer');
  
  // Login
  loginBtn.addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      if (adminEmails.includes(user.email)) {
        alert("Admin access granted");
        loginContainer.style.display = 'none';
        dashboard.style.display = 'block';
        loadUsers();
      } else {
        alert("Not authorized");
        auth.signOut();
      }
    } catch(e) {
      console.error("Login failed:", e);
    }
  });
  
  function loadUsers() {
    db.collection('users').onSnapshot(snapshot => {
      usersContainer.innerHTML = '';
      snapshot.forEach(doc => {
        const user = doc.data();
        const userId = doc.id;
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = <strong>${user.nickname || userId}</strong>;
  
        db.collection('users').doc(userId).collection('logs').onSnapshot(logSnap => {
          let logsHTML = '';
          logSnap.forEach(logDoc => {
            const log = logDoc.data();
            logsHTML += `<div class="log-entry">
              <strong>${log.action}</strong>: ${log.input} → ${log.output}
              <button class="action-btn" onclick="deleteLog('${userId}','${logDoc.id}')">Delete</button>
            </div>`;
          });
          userCard.innerHTML = <strong>${user.nickname || userId}</strong> + logsHTML +
            <br><button class="action-btn" onclick="resetNickname('${userId}')">Reset Nickname</button>;
        });
        usersContainer.appendChild(userCard);
      });
    });
  }
  
  window.deleteLog = (userId, logId) => {
    if(confirm("Delete this log?")) {
      db.collection('users').doc(userId).collection('logs').doc(logId).delete();
    }
  };
  
  window.resetNickname = (userId) => {
    if(confirm("Reset nickname for this user?")) {
      db.collection('users').doc(userId).update({nickname: ""});
    }
  };
});
