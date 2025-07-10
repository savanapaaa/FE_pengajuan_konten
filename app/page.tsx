"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  FileText,
  Users,
  BarChart3,
  Building2,
  Send,
  CalendarIcon,
  Eye,
  EyeOff,
  Edit,
  ImageIcon,
  Video,
  FileIcon,
  LogOut,
  User,
  History,
  Key,
  Copy,
  CheckCircle,
  Search,
  Trash2,
  FolderIcon,
  MessageSquare,
  DollarSign,
  Heart,
  Leaf,
  ArrowLeft,
} from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

// File conversion utilities
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

const createFileData = async (file: File) => {
  const base64 = await convertFileToBase64(file)
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    base64: base64,
    url: URL.createObjectURL(file), // For immediate preview
  }
}

interface FormData {
  tema: string
  judul: string
  mediaPemerintah: string[]
  mediaMassa: string[]
  jenisKonten: string[]
  jumlahProduksi: string
  durasi: string
  sourceBahan: string[]
  subSourceBahan: string[]
  nomorSurat: string
  uploadedFile: File | null
  uploadedDokumen: File | null
  uploadedGambar: File | null
  uploadedVideo: File | null
  uploadedAudioDubbing: File | null
  uploadedAudioBacksound: File | null
  audioDubbingLainLain: string
  uploadedBuktiMengetahui: File | null
  tanggalOrderMasuk: Date | undefined
  tanggalJadi: Date | undefined
  petugasPelaksana: string
  fileDisimpanDi: string
  supervisor: string
  tanggalTayang: Date | undefined
  keterangan: string
  pinSandi: string
}

interface LoginData {
  username: string
  password: string
}

interface EditAccessData {
  submissionId: string
  pin: string
}

interface FileData {
  name: string
  size: number
  type: string
  lastModified: number
  base64: string
  url: string
}

interface Submission {
  id: number
  submissionId: string
  pin: string
  tema: string
  judul: string
  jenisMedia: string
  mediaPemerintah: string[]
  mediaMassa: string[]
  jenisKonten: string[]
  tanggalOrder: string
  petugasPelaksana: string
  supervisor: string
  durasi: string
  jumlahProduksi: string
  tanggalSubmit: string
  lastModified?: string
  sourceBahan?: string[]
  nomorSurat?: string
  tanggalJadi?: string
  fileDisimpanDi?: string
  tanggalTayang?: string
  keterangan?: string
  audioDubbingLainLain?: string
  // Replace boolean indicators with actual file data
  uploadedFile?: FileData
  uploadedDokumen?: FileData
  uploadedGambar?: FileData
  uploadedVideo?: FileData
  uploadedAudioDubbing?: FileData
  uploadedAudioBacksound?: FileData
  uploadedBuktiMengetahui?: FileData
}

export default function PelayananPublikKomprehensif() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [isEditAccessDialogOpen, setIsEditAccessDialogOpen] = useState(false)
  const [isSubmissionSuccessOpen, setIsSubmissionSuccessOpen] = useState(false)
  const [currentView, setCurrentView] = useState<"form" | "history" | "edit">("form")
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null)
  const [generatedCredentials, setGeneratedCredentials] = useState<{ id: string; password: string } | null>(null)
  const [showCopySuccess, setShowCopySuccess] = useState(false)
  const [showPin, setShowPin] = useState(false)

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAdminEditDialogOpen, setIsAdminEditDialogOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  // File preview state
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<{
    name: string
    type: string
    url: string
    size: number
  } | null>(null)

  // Theme filter state for admin dashboard
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<string | null>(null)

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    submission: Submission | null
  }>({ isOpen: false, submission: null })

  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  })
  const [editAccessData, setEditAccessData] = useState<EditAccessData>({
    submissionId: "",
    pin: "",
  })
  const [loginError, setLoginError] = useState("")
  const [editAccessError, setEditAccessError] = useState("")

  const [formData, setFormData] = useState<FormData>({
    tema: "",
    judul: "",
    mediaPemerintah: [],
    mediaMassa: [],
    jenisKonten: [],
    jumlahProduksi: "",
    durasi: "",
    sourceBahan: [],
    subSourceBahan: [],
    nomorSurat: "",
    uploadedFile: null,
    uploadedDokumen: null,
    uploadedGambar: null,
    uploadedVideo: null,
    uploadedAudioDubbing: null,
    uploadedAudioBacksound: null,
    audioDubbingLainLain: "",
    uploadedBuktiMengetahui: null,
    tanggalOrderMasuk: undefined,
    tanggalJadi: undefined,
    petugasPelaksana: "",
    fileDisimpanDi: "",
    supervisor: "",
    tanggalTayang: undefined,
    keterangan: "",
    pinSandi: "",
  })

  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success")
  const [showToast, setShowToast] = useState(false)

  const [historySearchTerm, setHistorySearchTerm] = useState("")
  const [adminSearchTerm, setAdminSearchTerm] = useState("")

  // State untuk menyimpan submissions
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 1,
      submissionId: "SUB12345ABC",
      pin: "1234",
      tema: "Sosial",
      judul: "Kampanye Kesehatan Masyarakat",
      jenisMedia: "Media Pemerintah",
      mediaPemerintah: ["videotron", "instagram", "facebook"],
      mediaMassa: [],
      jenisKonten: ["video", "infografis"],
      tanggalOrder: "2024-01-15",
      petugasPelaksana: "Ahmad Rizki",
      supervisor: "Dr. Sari Indah",
      durasi: "30 detik",
      jumlahProduksi: "5 unit",
      tanggalSubmit: "2024-01-20 10:30",
      sourceBahan: ["text", "gambar", "video-file"],
      nomorSurat: "",
      tanggalJadi: "2024-01-25",
      fileDisimpanDi: "Server Utama/Kampanye2024",
      tanggalTayang: "2024-01-30",
      keterangan: "Kampanye untuk meningkatkan kesadaran masyarakat tentang pentingnya hidup sehat",
      audioDubbingLainLain: "",
      uploadedGambar: {
        name: "kampanye_kesehatan.jpg",
        size: 2048576,
        type: "image/jpeg",
        lastModified: Date.now(),
        base64:
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
        url: "/placeholder.svg?height=400&width=600&text=Kampanye%20Kesehatan",
      },
      uploadedVideo: {
        name: "video_kampanye.mp4",
        size: 15728640,
        type: "video/mp4",
        lastModified: Date.now(),
        base64: "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC...",
        url: "/placeholder.svg?height=300&width=500&text=Video%20Kampanye",
      },
      uploadedBuktiMengetahui: {
        name: "bukti_mengetahui_kampanye.pdf",
        size: 1024000,
        type: "application/pdf",
        lastModified: Date.now(),
        base64:
          "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQLQKMC4wNzcgMCAwIDEgNTAgNzUwIGNtCi9GMSAxMiBUZgooSGVsbG8gV29ybGQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDIwNCAwMDAwMCBuIAowMDAwMDAwMjk4IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMzk2CiUlRU9G",
        url: "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQLQKMC4wNzcgMCAwIDEgNTAgNzUwIGNtCi9GMSAxMiBUZgooSGVsbG8gV29ybGQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDIwNCAwMDAwMCBuIAowMDAwMDAwMjk4IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMzk2CiUlRU9G",
      },
    },
    {
      id: 2,
      submissionId: "SUB67890DEF",
      pin: "5678",
      tema: "Ekonomi",
      judul: "Promosi UMKM Lokal",
      jenisMedia: "Media Massa",
      mediaPemerintah: [],
      mediaMassa: ["media-cetak", "media-online"],
      jenisKonten: ["infografis", "naskah-berita"],
      tanggalOrder: "2024-01-18",
      petugasPelaksana: "Budi Santoso",
      supervisor: "Ir. Joko Widodo",
      durasi: "2 menit",
      jumlahProduksi: "10 unit",
      tanggalSubmit: "2024-01-19 14:20",
      lastModified: "2024-01-21 09:15",
      sourceBahan: ["file", "dokumen"],
      nomorSurat: "123/UMKM/2024",
      tanggalJadi: "2024-01-23",
      fileDisimpanDi: "Server Backup/UMKM2024",
      tanggalTayang: "2024-01-27",
      keterangan: "Promosi untuk mendukung UMKM lokal dalam meningkatkan penjualan",
      audioDubbingLainLain: "",
    },
    {
      id: 3,
      submissionId: "SUB11111GHI",
      pin: "9999",
      tema: "Lingkungan",
      judul: "Sosialisasi Bank Sampah",
      jenisMedia: "Media Pemerintah",
      mediaPemerintah: ["website", "banner", "bando"],
      mediaMassa: [],
      jenisKonten: ["naskah-berita", "fotografis"],
      tanggalOrder: "2024-01-16",
      petugasPelaksana: "Siti Nurhaliza",
      supervisor: "Prof. Bambang Susilo",
      durasi: "1 menit",
      jumlahProduksi: "3 unit",
      tanggalSubmit: "2024-01-18 16:45",
      sourceBahan: ["text", "gambar"],
      nomorSurat: "",
      tanggalJadi: "2024-01-22",
      fileDisimpanDi: "Server Lingkungan/BankSampah",
      tanggalTayang: "2024-01-26",
      keterangan: "Sosialisasi program bank sampah untuk mengurangi limbah rumah tangga",
      audioDubbingLainLain: "",
    },
    {
      id: 4,
      submissionId: "SUB22222JKL",
      pin: "1111",
      tema: "Sosial",
      judul: "Edukasi Vaksinasi COVID-19",
      jenisMedia: "Media Massa",
      mediaPemerintah: [],
      mediaMassa: ["televisi", "radio"],
      jenisKonten: ["video", "audio"],
      tanggalOrder: "2024-01-14",
      petugasPelaksana: "Rina Sari",
      supervisor: "Dr. Sari Indah",
      durasi: "45 detik",
      jumlahProduksi: "8 unit",
      tanggalSubmit: "2024-01-17 11:30",
      sourceBahan: ["text", "file-audio-dubbing"],
      nomorSurat: "",
      tanggalJadi: "2024-01-21",
      fileDisimpanDi: "Server Media/Vaksinasi",
      tanggalTayang: "2024-01-25",
      keterangan: "Edukasi masyarakat tentang pentingnya vaksinasi COVID-19",
      audioDubbingLainLain: "",
    },
    {
      id: 5,
      submissionId: "SUB33333MNO",
      pin: "2222",
      tema: "Ekonomi",
      judul: "Program Bantuan Modal Usaha",
      jenisMedia: "Media Pemerintah",
      mediaPemerintah: ["televisi", "youtube", "website"],
      mediaMassa: [],
      jenisKonten: ["video", "bumper"],
      tanggalOrder: "2024-01-12",
      petugasPelaksana: "Dedi Kurniawan",
      supervisor: "Ir. Joko Widodo",
      durasi: "1 menit 30 detik",
      jumlahProduksi: "6 unit",
      tanggalSubmit: "2024-01-16 13:15",
      sourceBahan: ["text", "video-file", "dokumen"],
      nomorSurat: "456/MODAL/2024",
      tanggalJadi: "2024-01-20",
      fileDisimpanDi: "Server Ekonomi/ModalUsaha",
      tanggalTayang: "2024-01-24",
      keterangan: "Program bantuan modal untuk UMKM yang terdampak pandemi",
      audioDubbingLainLain: "",
    },
    {
      id: 6,
      submissionId: "SUB44444PQR",
      pin: "3333",
      tema: "Lingkungan",
      judul: "Gerakan Tanam Pohon",
      jenisMedia: "Media Massa",
      mediaPemerintah: [],
      mediaMassa: ["media-online", "media-cetak"],
      jenisKonten: ["fotografis", "infografis"],
      tanggalOrder: "2024-01-10",
      petugasPelaksana: "Maya Putri",
      supervisor: "Prof. Bambang Susilo",
      durasi: "N/A",
      jumlahProduksi: "15 unit",
      tanggalSubmit: "2024-01-15 08:20",
      sourceBahan: ["text", "gambar"],
      nomorSurat: "",
      tanggalJadi: "2024-01-19",
      fileDisimpanDi: "Server Lingkungan/TanamPohon",
      tanggalTayang: "2024-01-23",
      keterangan: "Kampanye gerakan tanam pohon untuk mengurangi polusi udara",
      audioDubbingLainLain: "",
    },
    {
      id: 7,
      submissionId: "SUB55555STU",
      pin: "4444",
      tema: "Sosial",
      judul: "Kampanye Anti Narkoba",
      jenisMedia: "Media Pemerintah",
      mediaPemerintah: ["videotron", "banner"],
      mediaMassa: [],
      jenisKonten: ["infografis"],
      tanggalOrder: "2024-01-08",
      petugasPelaksana: "Fajar Ramadhan",
      supervisor: "Dr. Sari Indah",
      durasi: "N/A",
      jumlahProduksi: "12 unit",
      tanggalSubmit: "2024-01-14 15:40",
      sourceBahan: ["text", "gambar"],
      nomorSurat: "",
      tanggalJadi: "2024-01-18",
      fileDisimpanDi: "Server Sosial/AntiNarkoba",
      tanggalTayang: "2024-01-22",
      keterangan: "Kampanye anti narkoba untuk remaja dan dewasa muda",
      audioDubbingLainLain: "",
    },
    {
      id: 8,
      submissionId: "SUB66666VWX",
      pin: "5555",
      tema: "Ekonomi",
      judul: "Sosialisasi Pajak Online",
      jenisMedia: "Media Massa",
      mediaPemerintah: [],
      mediaMassa: ["radio", "media-online"],
      jenisKonten: ["audio", "naskah-berita"],
      tanggalOrder: "2024-01-06",
      petugasPelaksana: "Indra Gunawan",
      supervisor: "Ir. Joko Widodo",
      durasi: "2 menit",
      jumlahProduksi: "4 unit",
      tanggalSubmit: "2024-01-13 12:10",
      sourceBahan: ["text", "file-audio-dubbing", "lain-lain-dubbing"],
      nomorSurat: "",
      tanggalJadi: "2024-01-17",
      fileDisimpanDi: "Server Ekonomi/PajakOnline",
      tanggalTayang: "2024-01-21",
      keterangan: "Sosialisasi kemudahan pembayaran pajak secara online",
      audioDubbingLainLain: "Perlu dubbing dengan suara yang jelas dan mudah dipahami untuk segmen radio",
    },
  ])

  // Data untuk checkbox options
  const mediaPemerintahOptions = [
    { id: "videotron", label: "Videotron", category: "Elektronik" },
    { id: "televisi", label: "Televisi", category: "Elektronik" },
    { id: "instagram", label: "Instagram", category: "Digital Sosial Media" },
    { id: "facebook", label: "Facebook", category: "Digital Sosial Media" },
    { id: "youtube", label: "Youtube", category: "Digital Sosial Media" },
    { id: "bando", label: "Bando", category: "Media Cetak" },
    { id: "banner", label: "Banner", category: "Media Cetak" },
    { id: "website", label: "Website", category: "Digital Online" },
  ]

  const mediaMassaOptions = [
    { id: "media-cetak", label: "Media Cetak" },
    { id: "media-online", label: "Media Online" },
    { id: "televisi", label: "Televisi" },
    { id: "radio", label: "Radio" },
  ]

  const jenisKontenOptions = [
    { id: "infografis", label: "Infografis" },
    { id: "naskah-berita", label: "Naskah Berita" },
    { id: "audio", label: "Audio" },
    { id: "video", label: "Video" },
    { id: "fotografis", label: "Fotografis" },
    { id: "bumper", label: "Bumper" },
  ]

  const sourceBahanOptions = [
    {
      id: "text",
      label: "Text",
      category: "Narasi",
    },
    {
      id: "file",
      label: "File",
      category: "Narasi",
    },
    {
      id: "surat",
      label: "Surat",
      category: "Narasi",
    },
    {
      id: "file-audio-dubbing",
      label: "File Audio",
      category: "Audio Dubbing",
    },
    {
      id: "lain-lain-dubbing",
      label: "Lain-lain",
      category: "Audio Dubbing",
    },
    {
      id: "file-audio-backsound",
      label: "File Audio",
      category: "Audio Backsound",
    },
    {
      id: "dokumen",
      label: "Dokumen",
      category: "File Pendukung Lainnya",
    },
    {
      id: "gambar",
      label: "Gambar",
      category: "File Pendukung Lainnya",
    },
    {
      id: "video-file",
      label: "Video",
      category: "File Pendukung Lainnya",
    },
  ]

  // Theme cards data
  const themeCards = [
    {
      tema: "Ekonomi",
      icon: DollarSign,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      borderColor: "border-green-200",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      count: submissions.filter((sub) => sub.tema === "Ekonomi").length,
      description: "Pengajuan terkait ekonomi dan keuangan",
    },
    {
      tema: "Sosial",
      icon: Heart,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      count: submissions.filter((sub) => sub.tema === "Sosial").length,
      description: "Pengajuan terkait sosial dan kemasyarakatan",
    },
    {
      tema: "Lingkungan",
      icon: Leaf,
      color: "bg-emerald-500",
      hoverColor: "hover:bg-emerald-600",
      borderColor: "border-emerald-200",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      count: submissions.filter((sub) => sub.tema === "Lingkungan").length,
      description: "Pengajuan terkait lingkungan dan keberlanjutan",
    },
  ]

  // Generate random ID only
  const generateSubmissionId = () => {
    return "SUB" + Math.random().toString(36).substr(2, 8).toUpperCase()
  }

  // Login functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    // Simple authentication (in real app, this would be API call)
    if (loginData.username === "diskominfo" && loginData.password === "batu123") {
      setIsAdminLoggedIn(true)
      setIsLoginDialogOpen(false)
      setLoginData({ username: "", password: "" })
      showToastMessage("Login berhasil! Selamat datang Admin", "success")
    } else {
      setLoginError("Username atau password salah")
      showToastMessage("Login gagal! Periksa username dan password", "error")
    }
  }

  const handleLogout = () => {
    setIsAdminLoggedIn(false)
    setLoginData({ username: "", password: "" })
    setSelectedThemeFilter(null) // Reset theme filter on logout
  }

  const handleLoginInputChange = (field: keyof LoginData, value: string) => {
    setLoginData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Edit access functions
  const handleEditAccess = (e: React.FormEvent) => {
    e.preventDefault()
    setEditAccessError("")

    // Find submission by ID and pin
    const submission = submissions.find(
      (sub) => sub.submissionId === editAccessData.submissionId && sub.pin === editAccessData.pin,
    )

    if (submission) {
      setEditingSubmission(submission)
      // Load ALL submission data into form
      setFormData({
        tema: submission.tema.toLowerCase(),
        judul: submission.judul,
        mediaPemerintah: submission.mediaPemerintah,
        mediaMassa: submission.mediaMassa,
        jenisKonten: submission.jenisKonten,
        jumlahProduksi: submission.jumlahProduksi,
        durasi: submission.durasi,
        sourceBahan: submission.sourceBahan || [],
        subSourceBahan: [],
        nomorSurat: submission.nomorSurat || "",
        uploadedFile: null, // Files can't be restored, but we can show placeholder
        uploadedDokumen: null,
        uploadedGambar: null,
        uploadedVideo: null,
        uploadedAudioDubbing: null,
        uploadedAudioBacksound: null,
        audioDubbingLainLain: submission.audioDubbingLainLain || "",
        uploadedBuktiMengetahui: null,
        tanggalOrderMasuk: submission.tanggalOrder ? new Date(submission.tanggalOrder) : undefined,
        tanggalJadi: submission.tanggalJadi ? new Date(submission.tanggalJadi) : undefined,
        petugasPelaksana: submission.petugasPelaksana,
        fileDisimpanDi: submission.fileDisimpanDi || "",
        supervisor: submission.supervisor,
        tanggalTayang: submission.tanggalTayang ? new Date(submission.tanggalTayang) : undefined,
        keterangan: submission.keterangan || "",
        pinSandi: submission.pin,
      })
      setCurrentView("edit")
      setIsEditAccessDialogOpen(false)
      setEditAccessData({ submissionId: "", pin: "" })
      showToastMessage("Akses edit berhasil! Data pengajuan dimuat", "success")
    } else {
      setEditAccessError("ID Pengajuan atau PIN Sandi salah")
      showToastMessage("Akses ditolak! ID atau PIN salah", "error")
    }
  }

  const [fileUploadLoading, setFileUploadLoading] = useState<{ [key: string]: boolean }>({})

  const handleEditAccessInputChange = (field: keyof EditAccessData, value: string) => {
    setEditAccessData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSourceBahanChange = (sourceId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sourceBahan: checked ? [...prev.sourceBahan, sourceId] : prev.sourceBahan.filter((id) => id !== sourceId),
    }))
  }

  const handleInputChange = (field: keyof FormData, value: string | Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleMediaChange = (mediaType: "mediaPemerintah" | "mediaMassa", mediaId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [mediaType]: checked ? [...prev[mediaType], mediaId] : prev[mediaType].filter((id) => id !== mediaId),
    }))
  }

  const handleJenisKontenChange = (kontenId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      jenisKonten: checked ? [...prev.jenisKonten, kontenId] : prev.jenisKonten.filter((id) => id !== kontenId),
    }))
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType:
      | "uploadedFile"
      | "uploadedDokumen"
      | "uploadedGambar"
      | "uploadedVideo"
      | "uploadedAudioDubbing"
      | "uploadedAudioBacksound"
      | "uploadedBuktiMengetahui",
  ) => {
    const file = e.target.files?.[0]
    if (!file) {
      setFormData((prev) => ({ ...prev, [fileType]: null }))
      return
    }

    // Set loading state
    setFileUploadLoading((prev) => ({ ...prev, [fileType]: true }))

    try {
      // Create file data with base64 for storage
      const fileData = await createFileData(file)

      setFormData((prev) => ({
        ...prev,
        [fileType]: file, // Keep original file for form submission
      }))

      showToastMessage(`File ${file.name} berhasil diupload`, "success")
    } catch (error) {
      showToastMessage("Gagal mengupload file", "error")
      console.error("File upload error:", error)
    } finally {
      setFileUploadLoading((prev) => ({ ...prev, [fileType]: false }))
    }
  }

  // File preview handler
  const handleFilePreview = (fileData: FileData) => {
    setPreviewFile({
      name: fileData.name,
      type: getFileTypeCategory(fileData.type),
      url: fileData.base64 || fileData.url,
      size: fileData.size,
    })
    setIsFilePreviewOpen(true)
  }

  const getFileTypeCategory = (mimeType: string): string => {
    if (mimeType.startsWith("image/")) return "image"
    if (mimeType === "application/pdf") return "pdf"
    if (mimeType.startsWith("video/")) return "video"
    if (mimeType.startsWith("audio/")) return "audio"
    return "document"
  }

  // Generate mock file URL for preview
  const generateMockFileUrl = (fileName: string, fileType: string) => {
    // In a real application, this would be the actual file URL from your storage
    switch (fileType) {
      case "image":
        return `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(fileName)}`
      case "pdf":
        return `data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQLQKMC4wNzcgMCAwIDEgNTAgNzUwIGNtCi9GMSAxMiBUZgooSGVsbG8gV29ybGQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDIwNCAwMDAwMCBuIAowMDAwMDAwMjk4IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMzk2CiUlRU9G`
      case "document":
        return `data:text/plain;charset=utf-8,${encodeURIComponent(`Dokumen: ${fileName}\n\nIni adalah preview dokumen demo.\nKonten dokumen akan ditampilkan di sini.\n\nDalam aplikasi nyata, konten ini akan diambil dari file yang sebenarnya.`)}`
      case "video":
        return `/placeholder.svg?height=300&width=500&text=${encodeURIComponent("Video: " + fileName)}`
      case "audio":
        return `/placeholder.svg?height=200&width=400&text=${encodeURIComponent("Audio: " + fileName)}`
      default:
        return `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(fileName)}`
    }
  }

  // Delete submission function
  const handleDeleteSubmission = (submission: Submission) => {
    setDeleteConfirmation({ isOpen: true, submission })
  }

  const confirmDelete = () => {
    if (deleteConfirmation.submission) {
      const updatedSubmissions = submissions.filter((sub) => sub.id !== deleteConfirmation.submission!.id)
      setSubmissions(updatedSubmissions)

      showToastMessage(`Dokumen "${deleteConfirmation.submission.judul}" berhasil dihapus`, "success")

      setDeleteConfirmation({ isOpen: false, submission: null })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate PIN
    if (!formData.pinSandi || formData.pinSandi.length < 4) {
      alert("PIN Sandi harus diisi minimal 4 karakter!")
      return
    }

    // Process uploaded files
    const processedFiles: { [key: string]: FileData | undefined } = {}

    try {
      if (formData.uploadedFile) {
        processedFiles.uploadedFile = await createFileData(formData.uploadedFile)
      }
      if (formData.uploadedDokumen) {
        processedFiles.uploadedDokumen = await createFileData(formData.uploadedDokumen)
      }
      if (formData.uploadedGambar) {
        processedFiles.uploadedGambar = await createFileData(formData.uploadedGambar)
      }
      if (formData.uploadedVideo) {
        processedFiles.uploadedVideo = await createFileData(formData.uploadedVideo)
      }
      if (formData.uploadedAudioDubbing) {
        processedFiles.uploadedAudioDubbing = await createFileData(formData.uploadedAudioDubbing)
      }
      if (formData.uploadedAudioBacksound) {
        processedFiles.uploadedAudioBacksound = await createFileData(formData.uploadedAudioBacksound)
      }
      if (formData.uploadedBuktiMengetahui) {
        processedFiles.uploadedBuktiMengetahui = await createFileData(formData.uploadedBuktiMengetahui)
      }
    } catch (error) {
      showToastMessage("Gagal memproses file upload", "error")
      return
    }

    if (editingSubmission) {
      // Update existing submission
      const updatedSubmissions = submissions.map((sub) => {
        if (sub.id === editingSubmission.id) {
          return {
            ...sub,
            tema: formData.tema.charAt(0).toUpperCase() + formData.tema.slice(1),
            judul: formData.judul,
            mediaPemerintah: formData.mediaPemerintah,
            mediaMassa: formData.mediaMassa,
            jenisKonten: formData.jenisKonten,
            jumlahProduksi: formData.jumlahProduksi,
            durasi: formData.durasi,
            sourceBahan: formData.sourceBahan,
            nomorSurat: formData.nomorSurat,
            audioDubbingLainLain: formData.audioDubbingLainLain,
            tanggalOrder: formData.tanggalOrderMasuk
              ? format(formData.tanggalOrderMasuk, "yyyy-MM-dd")
              : sub.tanggalOrder,
            tanggalJadi: formData.tanggalJadi ? format(formData.tanggalJadi, "yyyy-MM-dd") : sub.tanggalJadi,
            petugasPelaksana: formData.petugasPelaksana,
            fileDisimpanDi: formData.fileDisimpanDi,
            supervisor: formData.supervisor,
            tanggalTayang: formData.tanggalTayang ? format(formData.tanggalTayang, "yyyy-MM-dd") : sub.tanggalTayang,
            keterangan: formData.keterangan,
            pin: formData.pinSandi,
            lastModified: format(new Date(), "yyyy-MM-dd HH:mm"),
            // Update with actual file data
            uploadedFile: processedFiles.uploadedFile || sub.uploadedFile,
            uploadedDokumen: processedFiles.uploadedDokumen || sub.uploadedDokumen,
            uploadedGambar: processedFiles.uploadedGambar || sub.uploadedGambar,
            uploadedVideo: processedFiles.uploadedVideo || sub.uploadedVideo,
            uploadedAudioDubbing: processedFiles.uploadedAudioDubbing || sub.uploadedAudioDubbing,
            uploadedAudioBacksound: processedFiles.uploadedAudioBacksound || sub.uploadedAudioBacksound,
            uploadedBuktiMengetahui: processedFiles.uploadedBuktiMengetahui || sub.uploadedBuktiMengetahui,
          }
        }
        return sub
      })

      setSubmissions(updatedSubmissions)
      console.log("Updated submission:", editingSubmission.submissionId)

      if (isAdminLoggedIn) {
        alert("Pengajuan berhasil diperbarui oleh Admin!")
        setCurrentView("form")
      } else {
        alert("Pengajuan berhasil diperbarui!")
        setCurrentView("form")
      }
      setEditingSubmission(null)
      setSelectedSubmission(null)
      // Reset form
      setFormData({
        tema: "",
        judul: "",
        mediaPemerintah: [],
        mediaMassa: [],
        jenisKonten: [],
        jumlahProduksi: "",
        durasi: "",
        sourceBahan: [],
        subSourceBahan: [],
        nomorSurat: "",
        uploadedFile: null,
        uploadedDokumen: null,
        uploadedGambar: null,
        uploadedVideo: null,
        uploadedAudioDubbing: null,
        uploadedAudioBacksound: null,
        audioDubbingLainLain: "",
        uploadedBuktiMengetahui: null,
        tanggalOrderMasuk: undefined,
        tanggalJadi: undefined,
        petugasPelaksana: "",
        fileDisimpanDi: "",
        supervisor: "",
        tanggalTayang: undefined,
        keterangan: "",
        pinSandi: "",
      })
    } else {
      // Create new submission
      const submissionId = generateSubmissionId()
      const currentDate = new Date()

      // Determine jenis media based on selected options
      let jenisMedia = ""
      if (formData.mediaPemerintah.length > 0 && formData.mediaMassa.length > 0) {
        jenisMedia = "Media Pemerintah & Media Massa"
      } else if (formData.mediaPemerintah.length > 0) {
        jenisMedia = "Media Pemerintah"
      } else if (formData.mediaMassa.length > 0) {
        jenisMedia = "Media Massa"
      }

      const newSubmission: Submission = {
        id: submissions.length + 1,
        submissionId: submissionId,
        pin: formData.pinSandi,
        tema: formData.tema.charAt(0).toUpperCase() + formData.tema.slice(1),
        judul: formData.judul,
        jenisMedia: jenisMedia,
        mediaPemerintah: formData.mediaPemerintah,
        mediaMassa: formData.mediaMassa,
        jenisKonten: formData.jenisKonten,
        tanggalOrder: formData.tanggalOrderMasuk
          ? format(formData.tanggalOrderMasuk, "yyyy-MM-dd")
          : format(currentDate, "yyyy-MM-dd"),
        petugasPelaksana: formData.petugasPelaksana,
        supervisor: formData.supervisor,
        durasi: formData.durasi || "N/A",
        jumlahProduksi: formData.jumlahProduksi || "1 unit",
        tanggalSubmit: format(currentDate, "yyyy-MM-dd HH:mm"),
        sourceBahan: formData.sourceBahan,
        nomorSurat: formData.nomorSurat,
        tanggalJadi: formData.tanggalJadi ? format(formData.tanggalJadi, "yyyy-MM-dd") : undefined,
        fileDisimpanDi: formData.fileDisimpanDi,
        tanggalTayang: formData.tanggalTayang ? format(formData.tanggalTayang, "yyyy-MM-dd") : undefined,
        keterangan: formData.keterangan,
        audioDubbingLainLain: formData.audioDubbingLainLain,
        // Store actual file data
        uploadedFile: processedFiles.uploadedFile,
        uploadedDokumen: processedFiles.uploadedDokumen,
        uploadedGambar: processedFiles.uploadedGambar,
        uploadedVideo: processedFiles.uploadedVideo,
        uploadedAudioDubbing: processedFiles.uploadedAudioDubbing,
        uploadedAudioBacksound: processedFiles.uploadedAudioBacksound,
        uploadedBuktiMengetahui: processedFiles.uploadedBuktiMengetahui,
      }

      // Add to submissions array
      setSubmissions((prev) => [...prev, newSubmission])

      setGeneratedCredentials({ id: submissionId, password: formData.pinSandi })
      setIsSubmissionSuccessOpen(true)
      console.log("New submission added:", newSubmission)
      console.log("Generated ID:", submissionId, "PIN:", formData.pinSandi)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setShowCopySuccess(true)
        setTimeout(() => {
          setShowCopySuccess(false)
        }, 2000)
        showToastMessage("Berhasil disalin ke clipboard!", "success")
      })
      .catch(() => {
        showToastMessage("Gagal menyalin ke clipboard", "error")
      })
  }

  const showToastMessage = (message: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  // Group media options by category
  const groupedMediaPemerintah = mediaPemerintahOptions.reduce(
    (acc, option) => {
      if (!acc[option.category]) {
        acc[option.category] = []
      }
      acc[option.category].push(option)
      return acc
    },
    {} as Record<string, typeof mediaPemerintahOptions>,
  )

  const groupedSourceBahan = sourceBahanOptions.reduce(
    (acc, option) => {
      if (!acc[option.category]) {
        acc[option.category] = []
      }
      acc[option.category].push(option)
      return acc
    },
    {} as Record<string, typeof sourceBahanOptions>,
  )

  // Helper functions untuk statistik
  const getRekapPerTema = () => {
    const rekap = submissions.reduce(
      (acc, submission) => {
        if (!acc[submission.tema]) {
          acc[submission.tema] = { total: 0 }
        }
        acc[submission.tema].total++
        return acc
      },
      {} as Record<string, { total: number }>,
    )
    return rekap
  }

  const getRekapMediaPemerintah = () => {
    const rekap: Record<string, number> = {}
    submissions.forEach((submission) => {
      submission.mediaPemerintah.forEach((media) => {
        const mediaLabel = mediaPemerintahOptions.find((opt) => opt.id === media)?.label || media
        rekap[mediaLabel] = (rekap[mediaLabel] || 0) + 1
      })
    })
    return rekap
  }

  const getRekapMediaMassa = () => {
    const rekap: Record<string, number> = {}
    submissions.forEach((submission) => {
      submission.mediaMassa.forEach((media) => {
        const mediaLabel = mediaMassaOptions.find((opt) => opt.id === media)?.label || media
        rekap[mediaLabel] = (rekap[mediaLabel] || 0) + 1
      })
    })
    return rekap
  }

  const getRekapJenisKonten = () => {
    const rekap: Record<string, number> = {}
    submissions.forEach((submission) => {
      submission.jenisKonten.forEach((konten) => {
        const kontenLabel = jenisKontenOptions.find((opt) => opt.id === konten)?.label || konten
        rekap[kontenLabel] = (rekap[kontenLabel] || 0) + 1
      })
    })
    return rekap
  }

  // Filter functions for search
  const filteredHistorySubmissions = submissions
    .filter(
      (submission) =>
        submission.submissionId.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
        submission.judul.toLowerCase().includes(historySearchTerm.toLowerCase()) ||
        submission.tema.toLowerCase().includes(historySearchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      // Parse tanggalSubmit which is in format "YYYY-MM-DD HH:mm"
      const parseSubmissionDate = (dateStr: string) => {
        // Handle format: "YYYY-MM-DD HH:mm"
        return new Date(dateStr.replace(" ", "T"))
      }

      const dateA = parseSubmissionDate(a.tanggalSubmit)
      const dateB = parseSubmissionDate(b.tanggalSubmit)

      // Sort in descending order (newest first)
      return dateB.getTime() - dateA.getTime()
    })

  const filteredAdminSubmissions = submissions
    .filter((submission) => {
      // Filter by theme if selected
      const matchesTheme = selectedThemeFilter ? submission.tema === selectedThemeFilter : true

      // Filter by search term
      const matchesSearch =
        submission.submissionId.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
        submission.judul.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
        submission.tema.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
        submission.petugasPelaksana.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
        submission.supervisor.toLowerCase().includes(adminSearchTerm.toLowerCase())

      return matchesTheme && matchesSearch
    })
    .sort((a, b) => {
      // Parse tanggalSubmit which is in format "YYYY-MM-DD HH:mm"
      const parseSubmissionDate = (dateStr: string) => {
        // Handle format: "YYYY-MM-DD HH:mm"
        return new Date(dateStr.replace(" ", "T"))
      }

      const dateA = parseSubmissionDate(a.tanggalSubmit)
      const dateB = parseSubmissionDate(b.tanggalSubmit)

      // Sort in descending order (newest first)
      return dateB.getTime() - dateA.getTime()
    })

  const stats = {
    total: submissions.length,
  }

  interface FileUploadProps {
    id: string
    label: string
    accept: string
    maxSize: string
    file: File | null
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    icon: React.ComponentType<{ className?: string }>
    bgColor?: string
    borderColor?: string
    hoverBorderColor?: string
    required?: boolean
  }

  const FileUploadComponent = ({
    id,
    label,
    accept,
    maxSize,
    file,
    onFileChange,
    icon: Icon,
    bgColor = "bg-gray-50",
    borderColor = "border-gray-300",
    hoverBorderColor = "hover:border-blue-400",
    required = false,
  }: FileUploadProps) => {
    const isLoading = fileUploadLoading[id]

    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
          {`Upload ${label}`} {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="space-y-3">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor={id}
              className={`flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed rounded-lg cursor-pointer ${bgColor} hover:bg-gray-100 ${borderColor} ${hoverBorderColor} transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                ) : (
                  <Icon className="w-8 h-8 mb-4 text-gray-500" />
                )}
                <p className="mb-2 text-xs sm:text-sm text-gray-500">
                  <span className="font-semibold">
                    {isLoading ? "Mengupload..." : `Klik untuk upload ${label.toLowerCase()}`}
                  </span>
                  {!isLoading && " atau drag and drop"}
                </p>
                <p className="text-xs text-gray-500">
                  {accept.toUpperCase()} ({maxSize})
                </p>
              </div>
              <input
                id={id}
                type="file"
                className="hidden"
                accept={accept}
                onChange={onFileChange}
                required={required}
                disabled={isLoading}
              />
            </label>
          </div>
          {file && (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, [id.replace("Upload", "uploaded")]: null }))}
                className="text-red-500 hover:text-red-700 transition-colors"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission)
    setIsViewDialogOpen(true)
  }

  const handleAdminEditSubmission = (submission: Submission) => {
    console.log("Loading submission for edit:", submission) // Debug log
    setSelectedSubmission(submission)
    setEditingSubmission(submission)

    // Load ALL submission data into form with complete mapping
    const formDataToSet = {
      tema: submission.tema.toLowerCase(),
      judul: submission.judul,
      mediaPemerintah: submission.mediaPemerintah || [],
      mediaMassa: submission.mediaMassa || [],
      jenisKonten: submission.jenisKonten || [],
      jumlahProduksi: submission.jumlahProduksi || "",
      durasi: submission.durasi || "",
      sourceBahan: submission.sourceBahan || [],
      subSourceBahan: [],
      nomorSurat: submission.nomorSurat || "",
      uploadedFile: null, // Files can't be restored
      uploadedDokumen: null,
      uploadedGambar: null,
      uploadedVideo: null,
      uploadedAudioDubbing: null,
      uploadedAudioBacksound: null,
      audioDubbingLainLain: submission.audioDubbingLainLain || "",
      uploadedBuktiMengetahui: null,
      tanggalOrderMasuk: submission.tanggalOrder ? new Date(submission.tanggalOrder) : undefined,
      tanggalJadi: submission.tanggalJadi ? new Date(submission.tanggalJadi) : undefined,
      petugasPelaksana: submission.petugasPelaksana || "",
      fileDisimpanDi: submission.fileDisimpanDi || "",
      supervisor: submission.supervisor || "",
      tanggalTayang: submission.tanggalTayang ? new Date(submission.tanggalTayang) : undefined,
      keterangan: submission.keterangan || "",
      pinSandi: submission.pin || "",
    }

    console.log("Setting form data:", formDataToSet) // Debug log
    setFormData(formDataToSet)

    // Close view dialog first, then set edit view
    setIsViewDialogOpen(false)

    // Use setTimeout to ensure state updates are processed
    setTimeout(() => {
      setCurrentView("edit")
      showToastMessage("Mode edit admin aktif! Data pengajuan dimuat", "success")
    }, 100)
  }

  const handleThemeCardClick = (tema: string) => {
    setSelectedThemeFilter(tema)
    setAdminSearchTerm("") // Reset search when selecting theme
  }

  const handleResetThemeFilter = () => {
    setSelectedThemeFilter(null)
    setAdminSearchTerm("") // Reset search when resetting theme
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border-l-4 ${
              toastType === "success"
                ? "bg-green-50 border-green-500 text-green-800"
                : toastType === "error"
                  ? "bg-red-50 border-red-500 text-red-800"
                  : "bg-blue-50 border-blue-500 text-blue-800"
            } transform transition-all duration-300 ease-in-out`}
          >
            <div className="flex-shrink-0">
              {toastType === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
              {toastType === "error" && (
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {toastType === "info" && (
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{toastMessage}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img
                src="/logo kominfo.svg"
                alt="Logo kominfo"
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                  {isAdminLoggedIn ? "Dashboard Admin" : "Sistem Manajemen Konten Publik"}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  {isAdminLoggedIn
                    ? "Kelola dan Pantau Pengajuan Produksi Konten"
                    : "Portal Pengajuan Produksi Media & Konten"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {isAdminLoggedIn ? (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Admin</span>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium px-2 sm:px-4 bg-transparent"
                      >
                        <LogOut className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Logout</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin keluar dari dashboard admin? Anda akan kembali ke halaman formulir
                          pengajuan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
                          Ya, Logout
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-3">
                  {/* History Button */}
                  <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-medium px-2 sm:px-4 bg-transparent"
                      >
                        <History className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Histori</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Histori Pengajuan</DialogTitle>
                        <DialogDescription>Daftar semua pengajuan yang telah disubmit</DialogDescription>
                      </DialogHeader>
                      <div className="mb-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Cari berdasarkan ID, judul, atau tema..."
                            value={historySearchTerm}
                            onChange={(e) => setHistorySearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        {/* Mobile Card Layout */}
                        <div className="block sm:hidden space-y-3">
                          {filteredHistorySubmissions.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-gray-500">Tidak ada pengajuan yang ditemukan</p>
                              {historySearchTerm && (
                                <p className="text-sm text-gray-400 mt-2">Coba ubah kata kunci pencarian Anda</p>
                              )}
                            </div>
                          ) : (
                            filteredHistorySubmissions.map((submission) => (
                              <Card key={submission.id} className="p-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start">
                                    <p className="font-mono text-sm font-semibold">{submission.submissionId}</p>
                                    <Badge
                                      variant="outline"
                                      className={
                                        submission.tema === "Sosial"
                                          ? "border-blue-200 text-blue-700"
                                          : submission.tema === "Ekonomi"
                                            ? "border-green-200 text-green-700"
                                            : "border-emerald-200 text-emerald-700"
                                      }
                                    >
                                      {submission.tema}
                                    </Badge>
                                  </div>
                                  <p className="font-medium text-gray-900">{submission.judul}</p>
                                  <div className="text-sm text-gray-600">
                                    <p>Submit: {submission.tanggalSubmit}</p>
                                    {submission.lastModified && (
                                      <p className="text-orange-600">Modified: {submission.lastModified}</p>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            ))
                          )}
                        </div>
                        {/* Desktop Table Layout */}
                        <div className="hidden sm:block">
                          <Table>
                            <TableHeader className="sticky top-0 z-10 bg-white">
                              <TableRow>
                                <TableHead>ID Pengajuan</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead>Tema</TableHead>
                                <TableHead>Tanggal Submit</TableHead>
                                <TableHead>Last Modified</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredHistorySubmissions.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={5} className="text-center py-8">
                                    <p className="text-gray-500">Tidak ada pengajuan yang ditemukan</p>
                                    {historySearchTerm && (
                                      <p className="text-sm text-gray-400 mt-2">Coba ubah kata kunci pencarian Anda</p>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ) : (
                                filteredHistorySubmissions.map((submission) => (
                                  <TableRow key={submission.id}>
                                    <TableCell className="font-mono text-sm">{submission.submissionId}</TableCell>
                                    <TableCell className="max-w-xs truncate">{submission.judul}</TableCell>
                                    <TableCell>
                                      <Badge
                                        variant="outline"
                                        className={
                                          submission.tema === "Sosial"
                                            ? "border-blue-200 text-blue-700"
                                            : submission.tema === "Ekonomi"
                                              ? "border-green-200 text-green-700"
                                              : "border-emerald-200 text-emerald-700"
                                        }
                                      >
                                        {submission.tema}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">{submission.tanggalSubmit}</TableCell>
                                    <TableCell className="text-sm">
                                      {submission.lastModified ? (
                                        <span className="text-orange-600">{submission.lastModified}</span>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Edit Access Button */}
                  <Dialog open={isEditAccessDialogOpen} onOpenChange={setIsEditAccessDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-medium px-2 sm:px-4 bg-transparent transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
                      >
                        <Key className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-md">
                      <DialogHeader>
                        <DialogTitle>Akses Edit Pengajuan</DialogTitle>
                        <DialogDescription>
                          Masukkan ID Pengajuan dan PIN Sandi untuk mengedit pengajuan Anda.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleEditAccess} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="submissionId">ID Pengajuan</Label>
                          <Input
                            id="submissionId"
                            type="text"
                            value={editAccessData.submissionId}
                            onChange={(e) => handleEditAccessInputChange("submissionId", e.target.value)}
                            placeholder="Contoh: SUB12345ABC"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="editPin">PIN Sandi</Label>
                          <Input
                            id="editPin"
                            type="password"
                            value={editAccessData.pin}
                            onChange={(e) => handleEditAccessInputChange("pin", e.target.value)}
                            placeholder="Masukkan PIN Sandi"
                            required
                          />
                        </div>
                        {editAccessError && <p className="text-sm text-red-600">{editAccessError}</p>}
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsEditAccessDialogOpen(false)}>
                            Batal
                          </Button>
                          <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                            Akses Edit
                          </Button>
                        </div>
                      </form>
                      {/* <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">
                          <strong>Demo Credentials:</strong>
                          <br />
                          ID: SUB12345ABC, PIN: 1234
                          <br />
                          ID: SUB67890DEF, PIN: 5678
                        </p>
                      </div> */}
                    </DialogContent>
                  </Dialog>

                  {/* Admin Login Button */}
                  <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium px-2 sm:px-6 bg-transparent transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
                      >
                        <span className="sm:hidden">Admin</span>
                        <span className="hidden sm:inline">Login Admin</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-md">
                      <DialogHeader>
                        <DialogTitle>Login Admin</DialogTitle>
                        <DialogDescription>
                          Masukkan username dan password untuk mengakses dashboard admin.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            type="text"
                            value={loginData.username}
                            onChange={(e) => handleLoginInputChange("username", e.target.value)}
                            placeholder="Masukkan username"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            value={loginData.password}
                            onChange={(e) => handleLoginInputChange("password", e.target.value)}
                            placeholder="Masukkan password"
                            required
                          />
                        </div>
                        {loginError && <p className="text-sm text-red-600">{loginError}</p>}
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsLoginDialogOpen(false)}>
                            Batal
                          </Button>
                          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Login
                          </Button>
                        </div>
                      </form>
                      {/* <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">
                          <strong>Demo Credentials:</strong>
                          <br />
                          Username: admin
                          <br />
                          Password: admin123
                        </p>
                      </div> */}
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Success Dialog */}
      <Dialog open={isSubmissionSuccessOpen} onOpenChange={setIsSubmissionSuccessOpen}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              <span>Pengajuan Berhasil!</span>
            </DialogTitle>
            <DialogDescription>
              Pengajuan Anda telah berhasil dikirim. Simpan ID dan PIN Sandi berikut untuk mengedit pengajuan di
              kemudian hari.
            </DialogDescription>
          </DialogHeader>
          {generatedCredentials && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <Label className="text-sm font-semibold text-gray-700">ID Pengajuan:</Label>
                    <p className="font-mono text-base sm:text-lg font-bold text-blue-600 break-all">
                      {generatedCredentials.id}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generatedCredentials.id)}
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white self-start sm:self-center transition-all duration-200 hover:scale-105 active:scale-95 relative"
                  >
                    <Copy className="h-4 w-4" />
                    {showCopySuccess && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
                        Tersalin!
                      </div>
                    )}
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <Label className="text-sm font-semibold text-gray-700">PIN Sandi:</Label>
                    <p className="font-mono text-base sm:text-lg font-bold text-blue-600 break-all">
                      {generatedCredentials.password}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generatedCredentials.password)}
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white self-start sm:self-center transition-all duration-200 hover:scale-105 active:scale-95 relative"
                  >
                    <Copy className="h-4 w-4" />
                    {showCopySuccess && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg animate-in fade-in-0 zoom-in-95 duration-200">
                        Tersalin!
                      </div>
                    )}
                  </Button>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Penting:</strong> Simpan ID dan PIN Sandi ini dengan aman. Anda akan membutuhkannya untuk
                  mengedit pengajuan di masa mendatang.
                </p>
              </div>
              <Button
                onClick={() => {
                  setIsSubmissionSuccessOpen(false)
                  setGeneratedCredentials(null)
                  // Reset form
                  setFormData({
                    tema: "",
                    judul: "",
                    mediaPemerintah: [],
                    mediaMassa: [],
                    jenisKonten: [],
                    jumlahProduksi: "",
                    durasi: "",
                    sourceBahan: [],
                    subSourceBahan: [],
                    nomorSurat: "",
                    uploadedFile: null,
                    uploadedDokumen: null,
                    uploadedGambar: null,
                    uploadedVideo: null,
                    uploadedAudioDubbing: null,
                    uploadedAudioBacksound: null,
                    audioDubbingLainLain: "",
                    uploadedBuktiMengetahui: null,
                    tanggalOrderMasuk: undefined,
                    tanggalJadi: undefined,
                    petugasPelaksana: "",
                    fileDisimpanDi: "",
                    supervisor: "",
                    tanggalTayang: undefined,
                    keterangan: "",
                    pinSandi: "",
                  })
                }}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Tutup
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Submission Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <span>Detail Pengajuan</span>
            </DialogTitle>
            <DialogDescription>Informasi lengkap pengajuan produksi konten</DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-3">Informasi Dasar</h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">ID Pengajuan:</Label>
                        <p className="font-mono text-sm font-bold text-blue-600">{selectedSubmission.submissionId}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Tema:</Label>
                        <Badge
                          variant="outline"
                          className={
                            selectedSubmission.tema === "Sosial"
                              ? "border-blue-200 text-blue-700"
                              : selectedSubmission.tema === "Ekonomi"
                                ? "border-green-200 text-green-700"
                                : "border-emerald-200 text-emerald-700"
                          }
                        >
                          {selectedSubmission.tema}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Judul:</Label>
                        <p className="text-sm text-gray-900">{selectedSubmission.judul}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-3">Detail Produksi</h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Jenis Media:</Label>
                        <p className="text-sm text-gray-900">{selectedSubmission.jenisMedia}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Durasi:</Label>
                        <p className="text-sm text-gray-900">{selectedSubmission.durasi}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Jumlah Produksi:</Label>
                        <p className="text-sm text-gray-900">{selectedSubmission.jumlahProduksi}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSubmission.mediaPemerintah.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      Media Pemerintah
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubmission.mediaPemerintah.map((media) => {
                        const mediaLabel = mediaPemerintahOptions.find((opt) => opt.id === media)?.label || media
                        return (
                          <Badge key={media} variant="secondary" className="bg-blue-100 text-blue-800">
                            {mediaLabel}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}

                {selectedSubmission.mediaMassa.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Media Massa
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubmission.mediaMassa.map((media) => {
                        const mediaLabel = mediaMassaOptions.find((opt) => opt.id === media)?.label || media
                        return (
                          <Badge key={media} variant="secondary" className="bg-green-100 text-green-800">
                            {mediaLabel}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Content Types */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Jenis Konten
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSubmission.jenisKonten.map((konten) => {
                    const kontenLabel = jenisKontenOptions.find((opt) => opt.id === konten)?.label || konten
                    return (
                      <Badge key={konten} variant="secondary" className="bg-purple-100 text-purple-800">
                        {kontenLabel}
                      </Badge>
                    )
                  })}
                </div>
              </div>

              {/* Staff Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Petugas Pelaksana</h3>
                  <p className="text-sm text-gray-900">{selectedSubmission.petugasPelaksana}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Supervisor</h3>
                  <p className="text-sm text-gray-900">{selectedSubmission.supervisor}</p>
                </div>
              </div>

              {/* Timeline & Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Timeline
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Tanggal Order:</Label>
                      <p className="text-gray-900">{selectedSubmission.tanggalOrder}</p>
                    </div>
                    {selectedSubmission.tanggalJadi && (
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Tanggal Jadi:</Label>
                        <p className="text-gray-900">{selectedSubmission.tanggalJadi}</p>
                      </div>
                    )}
                    {selectedSubmission.tanggalTayang && (
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Tanggal Tayang:</Label>
                        <p className="text-gray-900">{selectedSubmission.tanggalTayang}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Tanggal Submit:</Label>
                      <p className="text-gray-900">{selectedSubmission.tanggalSubmit}</p>
                    </div>
                    {selectedSubmission.lastModified && (
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Last Modified:</Label>
                        <p className="text-orange-600">{selectedSubmission.lastModified}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-800 mb-3 flex items-center">
                    <FolderIcon className="h-4 w-4 mr-2" />
                    File Storage
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <Label className="text-xs font-medium text-gray-600">File Disimpan Di:</Label>
                      <p className="text-gray-900 break-words">
                        {selectedSubmission.fileDisimpanDi || "Tidak ditentukan"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keterangan */}
              {selectedSubmission.keterangan && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Keterangan
                  </h3>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedSubmission.keterangan}</p>
                </div>
              )}

              {/* Uploaded Files Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <FileIcon className="h-4 w-4 mr-2" />
                  File yang Diupload
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedSubmission.uploadedFile && (
                    <div
                      className="flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => handleFilePreview(selectedSubmission.uploadedFile!)}
                    >
                      <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-800 truncate">
                          {selectedSubmission.uploadedFile.name}
                        </p>
                        <p className="text-xs text-blue-600">
                          {(selectedSubmission.uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Eye className="h-4 w-4 text-blue-500" />
                    </div>
                  )}
                  {selectedSubmission.uploadedDokumen && (
                    <div
                      className="flex items-center space-x-2 p-2 bg-orange-50 border border-orange-200 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                      onClick={() => handleFilePreview(selectedSubmission.uploadedDokumen!)}
                    >
                      <FileIcon className="h-5 w-5 text-orange-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-orange-800 truncate">
                          {selectedSubmission.uploadedDokumen.name}
                        </p>
                        <p className="text-xs text-orange-600">
                          {(selectedSubmission.uploadedDokumen.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Eye className="h-4 w-4 text-orange-500" />
                    </div>
                  )}
                  {selectedSubmission.uploadedGambar && (
                    <div
                      className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                      onClick={() => handleFilePreview(selectedSubmission.uploadedGambar!)}
                    >
                      <ImageIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-800 truncate">
                          {selectedSubmission.uploadedGambar.name}
                        </p>
                        <p className="text-xs text-green-600">
                          {(selectedSubmission.uploadedGambar.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Eye className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                  {selectedSubmission.uploadedVideo && (
                    <div
                      className="flex items-center space-x-2 p-2 bg-purple-50 border border-purple-200 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                      onClick={() => handleFilePreview(selectedSubmission.uploadedVideo!)}
                    >
                      <Video className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-purple-800 truncate">
                          {selectedSubmission.uploadedVideo.name}
                        </p>
                        <p className="text-xs text-purple-600">
                          {(selectedSubmission.uploadedVideo.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Eye className="h-4 w-4 text-purple-500" />
                    </div>
                  )}
                  {selectedSubmission.uploadedAudioDubbing && (
                    <div
                      className="flex items-center space-x-2 p-2 bg-indigo-50 border border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                      onClick={() => handleFilePreview(selectedSubmission.uploadedAudioDubbing!)}
                    >
                      <FileIcon className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-indigo-800 truncate">
                          {selectedSubmission.uploadedAudioDubbing.name}
                        </p>
                        <p className="text-xs text-indigo-600">
                          {(selectedSubmission.uploadedAudioDubbing.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Eye className="h-4 w-4 text-indigo-500" />
                    </div>
                  )}
                  {selectedSubmission.uploadedAudioBacksound && (
                    <div
                      className="flex items-center space-x-2 p-2 bg-teal-50 border border-teal-200 rounded-lg cursor-pointer hover:bg-teal-100 transition-colors"
                      onClick={() => handleFilePreview(selectedSubmission.uploadedAudioBacksound!)}
                    >
                      <FileIcon className="h-5 w-5 text-teal-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-teal-800 truncate">
                          {selectedSubmission.uploadedAudioBacksound.name}
                        </p>
                        <p className="text-xs text-teal-600">
                          {(selectedSubmission.uploadedAudioBacksound.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Eye className="h-4 w-4 text-teal-500" />
                    </div>
                  )}
                  {selectedSubmission.uploadedBuktiMengetahui && (
                    <div
                      className="flex items-center space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
                      onClick={() => handleFilePreview(selectedSubmission.uploadedBuktiMengetahui!)}
                    >
                      <FileText className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-yellow-800 truncate">
                          {selectedSubmission.uploadedBuktiMengetahui.name}
                        </p>
                        <p className="text-xs text-yellow-600">
                          {(selectedSubmission.uploadedBuktiMengetahui.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Eye className="h-4 w-4 text-yellow-500" />
                    </div>
                  )}
                  {!selectedSubmission.uploadedFile &&
                    !selectedSubmission.uploadedDokumen &&
                    !selectedSubmission.uploadedGambar &&
                    !selectedSubmission.uploadedVideo &&
                    !selectedSubmission.uploadedAudioDubbing &&
                    !selectedSubmission.uploadedAudioBacksound &&
                    !selectedSubmission.uploadedBuktiMengetahui && (
                      <div className="col-span-full text-center py-4">
                        <p className="text-gray-500 text-sm">Tidak ada file yang diupload</p>
                      </div>
                    )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Tutup
                </Button>
                <Button
                  onClick={() => {
                    handleAdminEditSubmission(selectedSubmission)
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Pengajuan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirmation.isOpen}
        onOpenChange={(open) => setDeleteConfirmation({ isOpen: open, submission: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Konfirmasi Hapus Dokumen
            </AlertDialogTitle>
            <AlertDialogDescription>Apakah Anda yakin ingin menghapus dokumen pengajuan ini?</AlertDialogDescription>
          </AlertDialogHeader>
          {deleteConfirmation.submission && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="space-y-2">
                  <p className="font-semibold text-red-900">ID: {deleteConfirmation.submission.submissionId}</p>
                  <p className="text-sm text-red-700">Judul: {deleteConfirmation.submission.judul}</p>
                  <p className="text-sm text-red-700">Tema: {deleteConfirmation.submission.tema}</p>
                  <p className="text-sm text-red-700">Petugas: {deleteConfirmation.submission.petugasPelaksana}</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ <strong>Peringatan:</strong> Tindakan ini tidak dapat dibatalkan. Semua data terkait dokumen ini
                  akan dihapus secara permanen.
                </p>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="w-4 h-4 mr-2" />
              Ya, Hapus Dokumen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* File Preview Dialog */}
      <Dialog open={isFilePreviewOpen} onOpenChange={setIsFilePreviewOpen}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileIcon className="h-5 w-5 text-blue-600" />
              <span>Preview File</span>
            </DialogTitle>
            <DialogDescription>
              {previewFile && `${previewFile.name} (${(previewFile.size / 1024 / 1024).toFixed(2)} MB)`}
            </DialogDescription>
          </DialogHeader>
          {previewFile && (
            <div className="space-y-4">
              {/* File Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="font-medium text-gray-600">Nama File:</Label>
                    <p className="text-gray-900 break-words">{previewFile.name}</p>
                  </div>
                  <div>
                    <Label className="font-medium text-gray-600">Tipe:</Label>
                    <p className="text-gray-900 capitalize">{previewFile.type}</p>
                  </div>
                  <div>
                    <Label className="font-medium text-gray-600">Ukuran:</Label>
                    <p className="text-gray-900">{(previewFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <div>
                    <Label className="font-medium text-gray-600">Status:</Label>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Tersedia
                    </Badge>
                  </div>
                </div>
              </div>

              {/* File Preview */}
              <div className="bg-white border rounded-lg p-4 max-h-[50vh] overflow-auto">
                {previewFile.type === "image" && (
                  <div className="flex justify-center">
                    <img
                      src={previewFile.url || "/placeholder.svg"}
                      alt={previewFile.name}
                      className="max-w-full max-h-96 object-contain rounded-lg shadow-sm"
                    />
                  </div>
                )}

                {previewFile.type === "pdf" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg">
                      <div className="text-center">
                        <FileText className="h-16 w-16 text-red-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-red-800 mb-2">PDF Document</h3>
                        <p className="text-red-600 mb-4">{previewFile.name}</p>
                        <Button
                          onClick={() => window.open(previewFile.url, "_blank")}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Buka PDF
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Catatan:</strong> Ini adalah preview demo. Dalam aplikasi nyata, PDF akan ditampilkan
                        menggunakan PDF viewer atau dapat diunduh untuk dilihat.
                      </p>
                    </div>
                  </div>
                )}

                {previewFile.type === "document" && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3 mb-4">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-blue-800">Dokumen Text</h3>
                          <p className="text-sm text-blue-600">{previewFile.name}</p>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                          {`Dokumen: ${previewFile.name}

Ini adalah preview dokumen demo.
Konten dokumen akan ditampilkan di sini.

Dalam aplikasi nyata, konten ini akan diambil dari file yang sebenarnya.

--- Contoh Konten ---
• Informasi penting
• Data pendukung
• Referensi dokumen
• Catatan tambahan

Tanggal: ${new Date().toLocaleDateString("id-ID")}
Status: Aktif`}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {previewFile.type === "video" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center p-8 bg-purple-50 rounded-lg">
                      <div className="text-center">
                        <Video className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-purple-800 mb-2">Video File</h3>
                        <p className="text-purple-600 mb-4">{previewFile.name}</p>
                        <div className="bg-gray-200 rounded-lg p-8 mb-4">
                          <p className="text-gray-600">Video preview akan ditampilkan di sini</p>
                        </div>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <Video className="h-4 w-4 mr-2" />
                          Play Video
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {previewFile.type === "audio" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center p-8 bg-indigo-50 rounded-lg">
                      <div className="text-center">
                        <FileIcon className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-indigo-800 mb-2">Audio File</h3>
                        <p className="text-indigo-600 mb-4">{previewFile.name}</p>
                        <div className="bg-gray-200 rounded-lg p-8 mb-4">
                          <div className="flex items-center justify-center space-x-4">
                            <div className="w-8 h-1 bg-indigo-400 rounded"></div>
                            <div className="w-12 h-2 bg-indigo-500 rounded"></div>
                            <div className="w-6 h-1 bg-indigo-400 rounded"></div>
                            <div className="w-10 h-3 bg-indigo-600 rounded"></div>
                            <div className="w-4 h-1 bg-indigo-400 rounded"></div>
                          </div>
                          <p className="text-gray-600 mt-4">Audio waveform preview</p>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                          <FileIcon className="h-4 w-4 mr-2" />
                          Play Audio
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsFilePreviewOpen(false)}>
                  Tutup
                </Button>
                <Button
                  onClick={() => {
                    // In real app, this would trigger file download
                    const link = document.createElement("a")
                    link.href = previewFile.url
                    link.download = previewFile.name
                    link.click()
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileIcon className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Navigation for editing mode */}
        {currentView === "edit" && (
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => {
                console.log("Returning to dashboard/form") // Debug log
                setCurrentView("form")
                setEditingSubmission(null)
                setSelectedSubmission(null)
                // Reset form
                setFormData({
                  tema: "",
                  judul: "",
                  mediaPemerintah: [],
                  mediaMassa: [],
                  jenisKonten: [],
                  jumlahProduksi: "",
                  durasi: "",
                  sourceBahan: [],
                  subSourceBahan: [],
                  nomorSurat: "",
                  uploadedFile: null,
                  uploadedDokumen: null,
                  uploadedGambar: null,
                  uploadedVideo: null,
                  uploadedAudioDubbing: null,
                  uploadedAudioBacksound: null,
                  audioDubbingLainLain: "",
                  uploadedBuktiMengetahui: null,
                  tanggalOrderMasuk: undefined,
                  tanggalJadi: undefined,
                  petugasPelaksana: "",
                  fileDisimpanDi: "",
                  supervisor: "",
                  tanggalTayang: undefined,
                  keterangan: "",
                  pinSandi: "",
                })
              }}
              className="mb-4"
            >
              ← {isAdminLoggedIn ? "Kembali ke Dashboard Admin" : "Kembali ke Formulir Baru"}
            </Button>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-2">
                {isAdminLoggedIn ? "Mode Edit Admin" : "Mode Edit Pengajuan"}
              </h3>
              <p className="text-sm text-orange-700">
                {isAdminLoggedIn ? "Admin sedang mengedit" : "Anda sedang mengedit"} pengajuan dengan ID:{" "}
                <span className="font-mono font-bold">{editingSubmission?.submissionId}</span>
              </p>
              {/* Debug info */}
              <div className="mt-2 text-xs text-orange-600">
                <p>Current view: {currentView}</p>
                <p>Form tema: {formData.tema}</p>
                <p>Form judul: {formData.judul}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulir Pengajuan */}
        {(!isAdminLoggedIn || (isAdminLoggedIn && currentView === "edit")) &&
          (currentView === "form" || currentView === "edit") && (
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <FileText className="h-6 w-6" />
                  <span>
                    {currentView === "edit" ? "Edit Pengajuan Produksi Konten" : "Formulir Pengajuan Produksi Konten"}
                  </span>
                </CardTitle>
                <CardDescription className="text-blue-100">
                  {currentView === "edit"
                    ? "Perbarui data pengajuan produksi konten media"
                    : "Lengkapi formulir berikut untuk mengajukan produksi konten media"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Tema */}
                    <div className="space-y-2">
                      <Label htmlFor="tema" className="text-sm font-semibold text-gray-700">
                        Tema <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.tema}
                        onValueChange={(value) => handleInputChange("tema", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tema" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sosial">Sosial</SelectItem>
                          <SelectItem value="ekonomi">Ekonomi</SelectItem>
                          <SelectItem value="lingkungan">Lingkungan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Judul */}
                    <div className="space-y-2">
                      <Label htmlFor="judul" className="text-sm font-semibold text-gray-700">
                        Judul <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="judul"
                        value={formData.judul}
                        onChange={(e) => handleInputChange("judul", e.target.value)}
                        placeholder="Masukkan judul konten"
                        required
                      />
                    </div>
                  </div>

                  {/* Jenis Media Section */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Jenis Media</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                      {/* Media Pemerintah */}
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-5 rounded-lg">
                          <h4 className="text-base font-semibold text-blue-800 flex items-center space-x-2 mb-4">
                            <Building2 className="h-5 w-5" />
                            <span>Media Pemerintah</span>
                          </h4>
                          <div className="space-y-4">
                            {Object.entries(groupedMediaPemerintah).map(([category, options]) => (
                              <div key={category} className="space-y-2">
                                <h5 className="text-sm font-medium text-blue-700">{category}</h5>
                                <div className="space-y-2 pl-4">
                                  {options.map((option) => (
                                    <div key={option.id} className="flex items-center space-x-3">
                                      <Checkbox
                                        id={option.id}
                                        checked={formData.mediaPemerintah.includes(option.id)}
                                        onCheckedChange={(checked) =>
                                          handleMediaChange("mediaPemerintah", option.id, checked as boolean)
                                        }
                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                      />
                                      <Label
                                        htmlFor={option.id}
                                        className="text-sm font-medium text-gray-700 cursor-pointer"
                                      >
                                        {option.label}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Media Massa */}
                      <div className="space-y-4">
                        <div className="bg-green-50 p-5 rounded-lg">
                          <h4 className="text-base font-semibold text-green-800 flex items-center space-x-2 mb-4">
                            <Users className="h-5 w-5" />
                            <span>Media Massa</span>
                          </h4>
                          <div className="space-y-2">
                            {mediaMassaOptions.map((option) => (
                              <div key={option.id} className="flex items-center space-x-3">
                                <Checkbox
                                  id={option.id}
                                  checked={formData.mediaMassa.includes(option.id)}
                                  onCheckedChange={(checked) =>
                                    handleMediaChange("mediaMassa", option.id, checked as boolean)
                                  }
                                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                />
                                <Label htmlFor={option.id} className="text-sm font-medium text-gray-700 cursor-pointer">
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Jenis Konten */}
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Jenis Konten/Produksi <span className="text-red-500">*</span>
                      </Label>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {jenisKontenOptions.map((option) => (
                            <div key={option.id} className="flex items-center space-x-3">
                              <Checkbox
                                id={option.id}
                                checked={formData.jenisKonten.includes(option.id)}
                                onCheckedChange={(checked) => handleJenisKontenChange(option.id, checked as boolean)}
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                              <Label htmlFor={option.id} className="text-sm font-medium text-gray-700 cursor-pointer">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Jumlah Produksi */}
                    <div className="space-y-2">
                      <Label htmlFor="jumlahProduksi" className="text-sm font-semibold text-gray-700">
                        Jumlah Produksi
                      </Label>
                      <Input
                        id="jumlahProduksi"
                        value={formData.jumlahProduksi}
                        onChange={(e) => handleInputChange("jumlahProduksi", e.target.value)}
                        placeholder="Contoh: 5 unit"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {/* Durasi */}
                      <div className="space-y-2">
                        <Label htmlFor="durasi" className="text-sm font-semibold text-gray-700">
                          Durasi
                        </Label>
                        <Input
                          id="durasi"
                          value={formData.durasi}
                          onChange={(e) => handleInputChange("durasi", e.target.value)}
                          placeholder="Contoh: 30 detik, 2 menit"
                        />
                      </div>
                    </div>

                    {/* Source/Bahan Section */}
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Source/Bahan</h3>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {Object.entries(groupedSourceBahan).map(([category, options]) => (
                          <div key={category} className="space-y-4">
                            <div className="bg-gray-50 p-5 rounded-lg">
                              <h4 className="text-base font-semibold text-gray-800 flex items-center space-x-2 mb-4">
                                <FileText className="h-5 w-5" />
                                <span>{category}</span>
                              </h4>
                              <div className="space-y-2">
                                {options.map((option) => (
                                  <div key={option.id} className="flex items-center space-x-3">
                                    <Checkbox
                                      id={option.id}
                                      checked={formData.sourceBahan.includes(option.id)}
                                      onCheckedChange={(checked) =>
                                        handleSourceBahanChange(option.id, checked as boolean)
                                      }
                                      className="data-[state=checked]:bg-gray-600 data-[state=checked]:border-gray-600"
                                    />
                                    <Label
                                      htmlFor={option.id}
                                      className="text-sm font-medium text-gray-700 cursor-pointer"
                                    >
                                      {option.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Conditional Fields */}
                      <div className="space-y-6">
                        {/* Nomor Surat (conditional) */}
                        {formData.sourceBahan.includes("surat") && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="nomorSurat" className="text-sm font-semibold text-gray-700">
                                Nomor Surat
                              </Label>
                              <Input
                                id="nomorSurat"
                                value={formData.nomorSurat}
                                onChange={(e) => handleInputChange("nomorSurat", e.target.value)}
                                placeholder="Masukkan nomor surat"
                              />
                            </div>
                          </div>
                        )}

                        {/* File Upload (conditional) */}
                        {formData.sourceBahan.includes("file") && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <FileUploadComponent
                              id="fileUpload"
                              label="File Narasi"
                              accept=".pdf,.doc,.docx,.txt"
                              maxSize="MAX. 10MB"
                              file={formData.uploadedFile}
                              onFileChange={(e) => handleFileUpload(e, "uploadedFile")}
                              icon={FileText}
                              required={false}
                            />
                          </div>
                        )}

                        {/* File Pendukung Uploads */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          {/* Upload Dokumen */}
                          {formData.sourceBahan.includes("dokumen") && (
                            <FileUploadComponent
                              id="dokumenUpload"
                              label="Dokumen"
                              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                              maxSize="MAX. 20MB"
                              file={formData.uploadedDokumen}
                              onFileChange={(e) => handleFileUpload(e, "uploadedDokumen")}
                              icon={FileIcon}
                              bgColor="bg-orange-50"
                              borderColor="border-orange-300"
                              hoverBorderColor="hover:border-orange-400"
                              required={false}
                            />
                          )}

                          {/* Upload Gambar */}
                          {formData.sourceBahan.includes("gambar") && (
                            <FileUploadComponent
                              id="gambarUpload"
                              label="Gambar"
                              accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
                              maxSize="MAX. 15MB"
                              file={formData.uploadedGambar}
                              onFileChange={(e) => handleFileUpload(e, "uploadedGambar")}
                              icon={ImageIcon}
                              bgColor="bg-green-50"
                              borderColor="border-green-300"
                              hoverBorderColor="hover:border-green-400"
                              required={false}
                            />
                          )}

                          {/* Upload Video */}
                          {formData.sourceBahan.includes("video-file") && (
                            <FileUploadComponent
                              id="videoUpload"
                              label="Video"
                              accept=".mp4,.avi,.mov,.wmv,.flv,.webm"
                              maxSize="MAX. 100MB"
                              file={formData.uploadedVideo}
                              onFileChange={(e) => handleFileUpload(e, "uploadedVideo")}
                              icon={Video}
                              bgColor="bg-purple-50"
                              borderColor="border-purple-300"
                              hoverBorderColor="hover:border-purple-400"
                              required={false}
                            />
                          )}
                        </div>
                      </div>
                      {/* Audio Dubbing Lain-lain Text Field (conditional) */}
                      {formData.sourceBahan.includes("lain-lain-dubbing") && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="audioDubbingLainLain" className="text-sm font-semibold text-gray-700">
                              Audio Dubbing - Lain-lain
                            </Label>
                            <Textarea
                              id="audioDubbingLainLain"
                              value={formData.audioDubbingLainLain}
                              onChange={(e) => handleInputChange("audioDubbingLainLain", e.target.value)}
                              placeholder="Jelaskan detail audio dubbing lain-lain yang dibutuhkan..."
                              rows={3}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
                      {/* Audio Dubbing File Upload */}
                      {formData.sourceBahan.includes("file-audio-dubbing") && (
                        <FileUploadComponent
                          id="audioDubbingUpload"
                          label="File Audio Dubbing"
                          accept=".mp3,.wav,.aac,.m4a,.ogg,.flac"
                          maxSize="MAX. 50MB"
                          file={formData.uploadedAudioDubbing}
                          onFileChange={(e) => handleFileUpload(e, "uploadedAudioDubbing")}
                          icon={FileIcon}
                          bgColor="bg-indigo-50"
                          borderColor="border-indigo-300"
                          hoverBorderColor="hover:border-indigo-400"
                          required={false}
                        />
                      )}

                      {/* Audio Backsound File Upload */}
                      {formData.sourceBahan.includes("file-audio-backsound") && (
                        <FileUploadComponent
                          id="audioBacksoundUpload"
                          label="File Audio Backsound"
                          accept=".mp3,.wav,.aac,.m4a,.ogg,.flac"
                          maxSize="MAX. 50MB"
                          file={formData.uploadedAudioBacksound}
                          onFileChange={(e) => handleFileUpload(e, "uploadedAudioBacksound")}
                          icon={FileIcon}
                          bgColor="bg-teal-50"
                          borderColor="border-teal-300"
                          hoverBorderColor="hover:border-teal-400"
                          required={false}
                        />
                      )}
                    </div>
                  </div>

                  {/* Tanggal Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Tanggal Order Masuk</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.tanggalOrderMasuk
                              ? format(formData.tanggalOrderMasuk, "dd MMMM yyyy", { locale: id })
                              : "Pilih tanggal"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.tanggalOrderMasuk}
                            onSelect={(date) => handleInputChange("tanggalOrderMasuk", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Tanggal Jadi</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.tanggalJadi
                              ? format(formData.tanggalJadi, "dd MMMM yyyy", { locale: id })
                              : "Pilih tanggal"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.tanggalJadi}
                            onSelect={(date) => handleInputChange("tanggalJadi", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Petugas Pelaksana */}
                    <div className="space-y-2">
                      <Label htmlFor="petugasPelaksana" className="text-sm font-semibold text-gray-700">
                        Petugas Pelaksana
                      </Label>
                      <Input
                        id="petugasPelaksana"
                        value={formData.petugasPelaksana}
                        onChange={(e) => handleInputChange("petugasPelaksana", e.target.value)}
                        placeholder="Nama petugas pelaksana"
                      />
                    </div>

                    {/* File Disimpan Di */}
                    <div className="space-y-2">
                      <Label htmlFor="fileDisimpanDi" className="text-sm font-semibold text-gray-700">
                        File Disimpan Di
                      </Label>
                      <Input
                        id="fileDisimpanDi"
                        value={formData.fileDisimpanDi}
                        onChange={(e) => handleInputChange("fileDisimpanDi", e.target.value)}
                        placeholder="Lokasi penyimpanan file"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Supervisor */}
                    <div className="space-y-2">
                      <Label htmlFor="supervisor" className="text-sm font-semibold text-gray-700">
                        Supervisor
                      </Label>
                      <Input
                        id="supervisor"
                        value={formData.supervisor}
                        onChange={(e) => handleInputChange("supervisor", e.target.value)}
                        placeholder="Nama supervisor"
                      />
                    </div>

                    {/* Tanggal Tayang */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">Tanggal Tayang</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.tanggalTayang
                              ? format(formData.tanggalTayang, "dd MMMM yyyy", { locale: id })
                              : "Pilih tanggal"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.tanggalTayang}
                            onSelect={(date) => handleInputChange("tanggalTayang", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Keterangan */}
                  <div className="space-y-2">
                    <Label htmlFor="keterangan" className="text-sm font-semibold text-gray-700">
                      Keterangan
                    </Label>
                    <Textarea
                      id="keterangan"
                      value={formData.keterangan}
                      onChange={(e) => handleInputChange("keterangan", e.target.value)}
                      placeholder="Keterangan tambahan..."
                      rows={4}
                    />
                  </div>

                  {/* PIN Sandi Dokumen */}
                  <div className="space-y-2">
                    <Label htmlFor="pinSandi" className="text-sm font-semibold text-gray-700">
                      PIN Sandi Dokumen <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="pinSandi"
                        type={showPin ? "text" : "password"}
                        value={formData.pinSandi}
                        onChange={(e) => handleInputChange("pinSandi", e.target.value)}
                        placeholder="Masukkan PIN 4-6 digit (mudah diingat)"
                        minLength={4}
                        maxLength={6}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      PIN ini akan digunakan untuk mengedit pengajuan di kemudian hari. Gunakan kombinasi angka yang
                      mudah Anda ingat.
                    </p>
                  </div>

                  {/* Upload Bukti Mengetahui */}
                  <div className="space-y-2">
                    <Label htmlFor="buktiMengetahuiUpload" className="text-sm font-semibold text-gray-700">
                      Upload Bukti Mengetahui <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-xs text-gray-500 mb-3">(Kepala Bidang Informasi Komunikasi Publik)</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="buktiMengetahuiUpload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-yellow-50 hover:bg-yellow-100 border-yellow-300 hover:border-yellow-400 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileText className="w-8 h-8 mb-4 text-yellow-600" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Klik untuk upload bukti mengetahui</span> atau drag and
                              drop
                            </p>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (MAX. 5MB)</p>
                          </div>
                          <input
                            id="buktiMengetahuiUpload"
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, "uploadedBuktiMengetahui")}
                            required={true}
                          />
                        </label>
                      </div>
                      {formData.uploadedBuktiMengetahui && (
                        <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <FileText className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {formData.uploadedBuktiMengetahui.name}
                              </p>
                              <p className="text-xs text-yellow-600">
                                {(formData.uploadedBuktiMengetahui.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, uploadedBuktiMengetahui: null }))}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-semibold flex items-center justify-center space-x-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>{currentView === "edit" ? "Perbarui Pengajuan" : "Kirim Pengajuan"}</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

        {/* Admin Dashboard - Only show if logged in */}
        {isAdminLoggedIn && currentView === "form" && (
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 gap-6 max-w-md">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Pengajuan</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rekap Dashboard - Simplified to 2 cards side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rekap Per Tema */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span>Rekap Per Tema</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(getRekapPerTema()).map(([tema, data]) => (
                      <div key={tema} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700">{tema}</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {data.total}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Rekap Jenis Konten */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span>Rekap Jenis Konten</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(getRekapJenisKonten())
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 6) // Show only top 6 items
                      .map(([konten, jumlah]) => (
                        <div key={konten} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700">{konten}</span>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            {jumlah}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Theme Filter Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Daftar Pengajuan Produksi Konten</span>
                  {selectedThemeFilter && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetThemeFilter}
                      className="flex items-center space-x-2 bg-transparent"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Semua Tema</span>
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedThemeFilter
                    ? `Menampilkan pengajuan dengan tema ${selectedThemeFilter}`
                    : "Pilih tema untuk melihat pengajuan berdasarkan kategori"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedThemeFilter ? (
                  // Theme Selection Cards
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {themeCards.map((theme) => {
                      const IconComponent = theme.icon
                      return (
                        <Card
                          key={theme.tema}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 ${theme.borderColor} ${theme.bgColor}`}
                          onClick={() => handleThemeCardClick(theme.tema)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`p-3 rounded-full ${theme.color} text-white`}>
                                  <IconComponent className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className={`font-semibold text-lg ${theme.textColor}`}>{theme.tema}</h3>
                                  <p className="text-sm text-gray-600">{theme.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-2xl font-bold ${theme.textColor}`}>{theme.count}</div>
                                <div className="text-xs text-gray-500">pengajuan</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  // Filtered Submissions View
                  <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Cari berdasarkan ID, judul, petugas, atau supervisor..."
                          value={adminSearchTerm}
                          onChange={(e) => setAdminSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="block lg:hidden space-y-4">
                      {filteredAdminSubmissions.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">
                            Tidak ada pengajuan yang ditemukan untuk tema {selectedThemeFilter}
                          </p>
                          {adminSearchTerm && (
                            <p className="text-sm text-gray-400 mt-2">Coba ubah kata kunci pencarian Anda</p>
                          )}
                        </div>
                      ) : (
                        filteredAdminSubmissions.map((submission) => (
                          <Card key={submission.id} className="p-4 border">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-mono text-sm font-semibold">{submission.submissionId}</p>
                                  <p className="font-medium text-gray-900 mt-1">{submission.judul}</p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    submission.tema === "Sosial"
                                      ? "border-blue-200 text-blue-700"
                                      : submission.tema === "Ekonomi"
                                        ? "border-green-200 text-green-700"
                                        : "border-emerald-200 text-emerald-700"
                                  }
                                >
                                  {submission.tema}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <div>
                                  <p className="font-medium">Media:</p>
                                  <p>{submission.jenisMedia}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Durasi:</p>
                                  <p>{submission.durasi}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Tanggal Order:</p>
                                  <p>{submission.tanggalOrder}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Tanggal Jadi:</p>
                                  <p>{submission.tanggalJadi || "-"}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Tanggal Tayang:</p>
                                  <p>{submission.tanggalTayang || "-"}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Petugas:</p>
                                  <p>{submission.petugasPelaksana}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Supervisor:</p>
                                  <p>{submission.supervisor}</p>
                                </div>
                              </div>
                              {submission.fileDisimpanDi && (
                                <div className="text-sm text-gray-600">
                                  <p className="font-medium">File Disimpan:</p>
                                  <p className="break-words">{submission.fileDisimpanDi}</p>
                                </div>
                              )}
                              {submission.keterangan && (
                                <div className="text-sm text-gray-600">
                                  <p className="font-medium">Keterangan:</p>
                                  <p className="line-clamp-2">{submission.keterangan}</p>
                                </div>
                              )}
                              <div className="flex items-center space-x-2 pt-2">
                                <span className="text-xs font-medium text-gray-600">Files:</span>
                                <div className="flex space-x-1">
                                  {submission.uploadedFile && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" title="File Narasi"></div>
                                  )}
                                  {submission.uploadedDokumen && (
                                    <div className="w-2 h-2 bg-orange-500 rounded-full" title="Dokumen"></div>
                                  )}
                                  {submission.uploadedGambar && (
                                    <div className="w-2 h-2 bg-green-500 rounded-full" title="Gambar"></div>
                                  )}
                                  {submission.uploadedVideo && (
                                    <div className="w-2 h-2 bg-purple-500 rounded-full" title="Video"></div>
                                  )}
                                  {submission.uploadedAudioDubbing && (
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full" title="Audio Dubbing"></div>
                                  )}
                                  {submission.uploadedAudioBacksound && (
                                    <div className="w-2 h-2 bg-teal-500 rounded-full" title="Audio Backsound"></div>
                                  )}
                                  {submission.uploadedBuktiMengetahui && (
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Bukti Mengetahui" />
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-end space-x-2 pt-3">
                                <Button size="sm" variant="outline" onClick={() => handleViewSubmission(submission)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Lihat
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Hapus
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                                        <Trash2 className="w-5 h-5" />
                                        Konfirmasi Hapus Dokumen
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Apakah Anda yakin ingin menghapus dokumen pengajuan ini?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Batal</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteSubmission(submission)}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Ya, Hapus
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>

                    {/* Desktop Table Layout */}
                    <div className="hidden lg:block">
                      <Table>
                        <TableHeader className="sticky top-0 z-10 bg-white">
                          <TableRow>
                            <TableHead>ID Pengajuan</TableHead>
                            <TableHead>Judul</TableHead>
                            <TableHead>Tema</TableHead>
                            <TableHead>Durasi</TableHead>
                            <TableHead>Tanggal Order</TableHead>
                            <TableHead>Tanggal Jadi</TableHead>
                            <TableHead>Tanggal Tayang</TableHead>
                            <TableHead>Petugas</TableHead>
                            <TableHead>Supervisor</TableHead>
                            <TableHead>Files</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAdminSubmissions.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={11} className="text-center py-8">
                                <p className="text-gray-500">
                                  Tidak ada pengajuan yang ditemukan untuk tema {selectedThemeFilter}
                                </p>
                                {adminSearchTerm && (
                                  <p className="text-sm text-gray-400 mt-2">Coba ubah kata kunci pencarian Anda</p>
                                )}
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredAdminSubmissions.map((submission) => (
                              <TableRow key={submission.id}>
                                <TableCell className="font-mono text-sm">{submission.submissionId}</TableCell>
                                <TableCell className="max-w-xs truncate">{submission.judul}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      submission.tema === "Sosial"
                                        ? "border-blue-200 text-blue-700"
                                        : submission.tema === "Ekonomi"
                                          ? "border-green-200 text-green-700"
                                          : submission.tema === "Lingkungan"
                                            ? "border-emerald-200 text-emerald-700"
                                            : ""
                                    }
                                  >
                                    {submission.tema}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm">{submission.durasi}</TableCell>
                                <TableCell className="text-sm">{submission.tanggalOrder}</TableCell>
                                <TableCell className="text-sm">{submission.tanggalJadi || "-"}</TableCell>
                                <TableCell className="text-sm">{submission.tanggalTayang || "-"}</TableCell>
                                <TableCell className="text-sm">{submission.petugasPelaksana}</TableCell>
                                <TableCell className="text-sm">{submission.supervisor}</TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-1">
                                    {submission.uploadedFile && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full" title="File Narasi"></div>
                                    )}
                                    {submission.uploadedDokumen && (
                                      <div className="w-2 h-2 bg-orange-500 rounded-full" title="Dokumen"></div>
                                    )}
                                    {submission.uploadedGambar && (
                                      <div className="w-2 h-2 bg-green-500 rounded-full" title="Gambar"></div>
                                    )}
                                    {submission.uploadedVideo && (
                                      <div className="w-2 h-2 bg-purple-500 rounded-full" title="Video"></div>
                                    )}
                                    {submission.uploadedAudioDubbing && (
                                      <div className="w-2 h-2 bg-indigo-500 rounded-full" title="Audio Dubbing"></div>
                                    )}
                                    {submission.uploadedAudioBacksound && (
                                      <div className="w-2 h-2 bg-teal-500 rounded-full" title="Audio Backsound"></div>
                                    )}
                                    {submission.uploadedBuktiMengetahui && (
                                      <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Bukti Mengetahui" />
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleViewSubmission(submission)}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      Lihat
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button size="sm" variant="destructive">
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Hapus
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                                            <Trash2 className="w-5 h-5" />
                                            Konfirmasi Hapus Dokumen
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Apakah Anda yakin ingin menghapus dokumen pengajuan ini?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Batal</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteSubmission(submission)}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                          >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Ya, Hapus
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
