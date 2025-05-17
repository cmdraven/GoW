// TODO: Replace the config object with your Firebase project's config from Firebase console
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBacV5Sfl7vYpIoKWIP9_QZAdhwdIZ8qFQ",
  authDomain: "guild-of-odin.firebaseapp.com",
  databaseURL: "https://guild-of-odin-default-rtdb.firebaseio.com",
  projectId: "guild-of-odin",
  storageBucket: "guild-of-odin.appspot.com",
  messagingSenderId: "995655823541",
  appId: "1:995655823541:web:3772f151e2a6abac2c8efc",
  measurementId: "G-BK3DCP9HTN"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Initialize Quill editor
const quill = new Quill('#storyEditor', {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic'],
      [{ 'header': 2 }],
      ['blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ]
  },
  placeholder: 'Begin your story here...',
  formats: ['bold', 'italic', 'header', 'list', 'blockquote', 'link']
});

// Tab switching
document.getElementById('storiesTab').addEventListener('click', () => {
  document.getElementById('storiesSection').style.display = 'block';
  document.getElementById('chatSection').style.display = 'none';
  document.getElementById('storiesTab').classList.add('active');
  document.getElementById('chatTab').classList.remove('active');
});

document.getElementById('chatTab').addEventListener('click', () => {
  document.getElementById('storiesSection').style.display = 'none';
  document.getElementById('chatSection').style.display = 'block';
  document.getElementById('chatTab').classList.add('active');
  document.getElementById('storiesTab').classList.remove('active');
});

// Story submission
function submitStory() {
  const content = quill.root.innerHTML;
  if (quill.getText().trim().length < 10) {
    alert('Please write at least 10 characters');
    return;
  }
  
  const timestamp = Date.now();
  const date = new Date(timestamp).toLocaleDateString();
  
  database.ref('stories/' + timestamp).set({
    content: content,
    timestamp: timestamp,
    date: date
  }).then(() => {
    quill.root.innerHTML = '';
  });
}

// Chat functionality
function sendMessage() {
  const message = document.getElementById('messageInput').value.trim();
  if (message.length < 2) return;
  
  const timestamp = Date.now();
  database.ref('messages/' + timestamp).set({
    text: message,
    timestamp: timestamp
  }).then(() => {
    document.getElementById('messageInput').value = '';
  });
}

// Load stories with better formatting
database.ref('stories').orderByChild('timestamp').limitToLast(20).on('value', (snapshot) => {
  const stories = snapshot.val();
  const storyList = document.getElementById('storyList');
  storyList.innerHTML = '';
  
  if (!stories) {
    storyList.innerHTML = '<p class="empty-message">No stories yet. Be the first to share!</p>';
    return;
  }
  
  Object.keys(stories).sort().reverse().forEach(key => {
    const storyDiv = document.createElement('div');
    storyDiv.className = 'story';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'story-content';
    contentDiv.innerHTML = stories[key].content;
    
    const metaDiv = document.createElement('div');
    metaDiv.className = 'story-meta';
    metaDiv.textContent = `Posted on ${stories[key].date || 'an unknown date'}`;
    
    storyDiv.appendChild(contentDiv);
    storyDiv.appendChild(metaDiv);
    storyList.appendChild(storyDiv);
  });
});

// Load chat messages
database.ref('messages').orderByChild('timestamp').limitToLast(30).on('value', (snapshot) => {
  const messages = snapshot.val();
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.innerHTML = '';
  
  if (!messages) {
    chatMessages.innerHTML = '<p class="empty-message">Start the conversation</p>';
    return;
  }
  
  Object.keys(messages).sort().forEach(key => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = messages[key].text;
    chatMessages.appendChild(messageDiv);
  });
  
  chatMessages.scrollTop = chatMessages.scrollHeight;
});