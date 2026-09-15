import { IssueTicket } from '../types';

export const INITIAL_SAMPLE_TICKETS: IssueTicket[] = [
  {
    id: 'TK-101',
    contractNo: '9042',
    customerName: 'คุณอาร์ม (สาขาบางนา)',
    phone: '081-998-7766',
    requestType: 'ปิด Proxy ให้หน่อยครับ',
    description: 'สัญญา 9042 รบกวนปิด Proxy ให้หน่อยครับ เครื่องต่อเน็ตแล้วเข้าโปรแกรมไม่ได้ครับ',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        note: 'พนักงานส่งคำขอแจ้งงาน',
        updatedBy: 'คุณอาร์ม'
      }
    ]
  },
  {
    id: 'TK-102',
    contractNo: '8891',
    customerName: 'คุณนก (บัญชี)',
    phone: '089-123-4567',
    requestType: 'ปิดพร็อกซี่',
    description: 'สัญญา 8891 ปิด Proxy ให้หน่อยค่ะ เข้าเว็บรายงานประจำวันไม่ได้ค่ะ',
    status: 'in_progress',
    technicianName: 'ฝ่ายเทคนิค (พี่เกม)',
    technicianNote: 'กำลังเข้าไปทำให้ครับ รอสักครู่นะครับ',
    createdAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
        note: 'พนักงานส่งคำขอแจ้งงาน',
        updatedBy: 'คุณนก'
      },
      {
        status: 'in_progress',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        note: 'กำลังเข้าไปทำให้ครับ รอสักครู่นะครับ',
        updatedBy: 'ฝ่ายเทคนิค (พี่เกม)'
      }
    ]
  },
  {
    id: 'TK-103',
    contractNo: '7723',
    customerName: 'คุณบอย (ฝ่ายขาย)',
    phone: '095-443-2211',
    requestType: 'ปลดล็อค / รีเซ็ตสิทธิ์',
    description: 'สัญญา 7723 รบกวนรีเซ็ตสิทธิ์เข้าใช้งานระบบให้หน่อยครับ',
    status: 'waiting_info',
    technicianName: 'ฝ่ายเทคนิค (พี่เกม)',
    technicianNote: 'ขอข้อมูลเพิ่มเติม: ขอรูปหน้าจอ Error หรือเลข IP เครื่องด้วยครับ',
    createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
        note: 'พนักงานส่งคำขอ',
        updatedBy: 'คุณบอย'
      },
      {
        status: 'waiting_info',
        timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
        note: 'ขอข้อมูลเพิ่มเติม: ขอรูปหน้าจอ Error หรือเลข IP เครื่องด้วยครับ',
        updatedBy: 'ฝ่ายเทคนิค (พี่เกม)'
      }
    ]
  },
  {
    id: 'TK-104',
    contractNo: '4510',
    customerName: 'คุณฝน (จัดซื้อ)',
    phone: '062-887-1122',
    requestType: 'ปิดพร็อกซี่',
    description: 'สัญญา 4510 ปิด Proxy ให้หน่อยค่ะ ขอบคุณค่ะ',
    status: 'resolved',
    technicianName: 'ฝ่ายเทคนิค (พี่เกม)',
    technicianNote: 'ปิด Proxy ให้เรียบร้อยแล้วครับ ทดสอบใช้งานได้เลยครับ',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        note: 'พนักงานส่งคำขอ',
        updatedBy: 'คุณฝน'
      },
      {
        status: 'resolved',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        note: 'ปิด Proxy ให้เรียบร้อยแล้วครับ ทดสอบใช้งานได้เลยครับ',
        updatedBy: 'ฝ่ายเทคนิค (พี่เกม)'
      }
    ]
  },
  {
    id: 'TK-105',
    contractNo: '5521',
    customerName: 'คุณกอล์ฟ (สาขาเซ็นทรัล)',
    phone: '086-332-9988',
    requestType: 'เปิด Find My Phone',
    description: 'สัญญา 5521 ลูกค้าผ่อนชำระครบกำหนดแล้วครับ รบกวนเปิด / ปลดล็อค Find My Phone ให้ลูกค้าด้วยครับ ขอบคุณครับ',
    status: 'resolved',
    technicianName: 'ฝ่ายเทคนิค (พี่เกม)',
    technicianNote: 'เปิด Find My Phone ในระบบเรียบร้อยแล้วครับ ลูกค้าสามารถเข้า iCloud ใช้งานได้ตามปกติครับ',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        note: 'พนักงานส่งคำขอแจ้งงาน',
        updatedBy: 'คุณกอล์ฟ'
      },
      {
        status: 'resolved',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        note: 'เปิด Find My Phone ในระบบเรียบร้อยแล้วครับ ลูกค้าสามารถเข้า iCloud ใช้งานได้ตามปกติครับ',
        updatedBy: 'ฝ่ายเทคนิค (พี่เกม)'
      }
    ]
  },
  {
    id: 'TK-106',
    contractNo: '6634',
    customerName: 'คุณมิ้นต์ (ฝ่ายสินเชื่อ)',
    phone: '091-778-5544',
    requestType: 'กรอกเลข SN ผิด',
    description: 'สัญญา 6634 ตอนทำรายการบันทึก Serial Number ผิดตัวท้าย จากเลข 8 เป็นตัวอักษร B รบกวนช่วยแก้ไขในระบบให้ทีค่ะ',
    status: 'in_progress',
    technicianName: 'ฝ่ายเทคนิค (พี่เกม)',
    technicianNote: 'รับเรื่องแล้วครับ กำลังเปิดระบบฐานข้อมูลเพื่อแก้ไขเลข SN ให้ถูกต้องครับ',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        note: 'พนักงานส่งคำขอแจ้งงาน',
        updatedBy: 'คุณมิ้นต์'
      },
      {
        status: 'in_progress',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        note: 'รับเรื่องแล้วครับ กำลังเปิดระบบฐานข้อมูลเพื่อแก้ไขเลข SN ให้ถูกต้องครับ',
        updatedBy: 'ฝ่ายเทคนิค (พี่เกม)'
      }
    ]
  }
];
