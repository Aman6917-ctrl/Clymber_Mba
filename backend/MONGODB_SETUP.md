# MongoDB Atlas Setup Guide

## Issue: IP Whitelist Error

Agar aapko yeh error aa raha hai:
```
MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster
```

## Fix Steps:

### Step 1: MongoDB Atlas Dashboard Kholo
1. https://cloud.mongodb.com pe jao
2. Login karo apne credentials se

### Step 2: IP Whitelist Add Karo
1. Left sidebar mein **"Network Access"** pe click karo
2. **"Add IP Address"** button click karo
3. Options:
   - **Option A (Recommended)**: "Add Current IP Address" button click karo - yeh automatically aapki current IP add kar dega
   - **Option B (Development Only)**: Manual IP add karo: `0.0.0.0/0` - yeh sab IPs allow karega (⚠️ Production ke liye secure nahi hai)
4. **"Confirm"** click karo
5. Wait karo 1-2 minutes (IP whitelist update hone mein time lagta hai)

### Step 3: Database User Check Karo
1. Left sidebar mein **"Database Access"** pe click karo
2. Check karo ki `amanvverma109_db_user` user exist karta hai
3. Agar nahi hai, naya user create karo with proper permissions

### Step 4: Connection String Verify Karo
`.env` file mein yeh hona chahiye:
```
MONGO_URI=mongodb+srv://amanvverma109_db_user:2Eaqg0Rb3cTcLrd4@cluster0.cnnuvip.mongodb.net/mba_predictor
PORT=3000
```

### Step 5: Server Restart Karo
```bash
# Ctrl+C se server stop karo
npm start
# ya development mode mein:
npm run dev
```

### Step 6: Database Seed Karo (Pehli baar)
```bash
npm run seed
```

## Quick Test:
```bash
curl http://localhost:3000/api/health
```

Agar MongoDB connect ho gaya, toh aapko response milega:
```json
{"status":"ok","message":"API is healthy","timestamp":"..."}
```

## Troubleshooting:

**Agar abhi bhi error aaye:**
1. MongoDB Atlas dashboard mein **"Network Access"** check karo - IP properly added hai ya nahi
2. Connection string mein password sahi hai ya nahi verify karo
3. Database name (`mba_predictor`) sahi hai ya nahi check karo
4. Cluster status check karo - cluster running hai ya nahi

**Common Issues:**
- IP whitelist update hone mein 2-3 minutes lag sakte hain
- Agar VPN use kar rahe ho, toh VPN IP bhi whitelist karna padega
- Firewall settings check karo
