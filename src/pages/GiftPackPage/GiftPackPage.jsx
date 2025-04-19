import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { AnimatePresence } from 'framer-motion'
import Loading from '../../components/Loading/Loading'
import GiftSuccessModal from '../../components/GiftSuccessModal/GiftSuccessModal'
import './GiftPackPage.scss'
import '../../scss/common.scss'

const API_URL = import.meta.env.VITE_API_URL
const itemsPerPage = 6

const GiftPackPage = () => {
  const [giftPacks, setGiftPacks] = useState([])
  const [claimedPacks, setClaimedPacks] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [claimedCode, setClaimedCode] = useState('')

  const userId = localStorage.getItem('userId')
  const { t } = useTranslation()

  const fetchGiftPacks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/giftPacks`)
      const all = await res.json()

      setTotalPages(Math.ceil(all.length / itemsPerPage))
      const start = (currentPage - 1) * itemsPerPage
      const currentItems = all.slice(start, start + itemsPerPage)
      setGiftPacks(currentItems)
    } catch (err) {
      setError(err.message || 'Error loading gift packs')
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchGiftPacks()
    if (userId) {
      fetch(`${API_URL}/claims?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => setClaimedPacks(data.map((d) => d.giftPackId)))
    }
  }, [fetchGiftPacks, userId])

  const handleClaim = async (giftPackId) => {
    if (!userId) {
      alert('請先登入！')
      window.location.href = '/login'
      return
    }

    const cardCode = `VIP${Math.floor(100 + Math.random() * 900)}` // 每次都生成新卡號

    await fetch(`${API_URL}/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        giftPackId,
        claimedAt: new Date(),
        cardCode,
      }),
    })

    // 不用判斷是否已領取，直接彈窗
    setClaimedCode(cardCode)
    setShowSuccessModal(true)
  }

  if (loading) return <Loading justifyContent="center" />

  return (
    <div className="gift-page">
      {/* =====Breadcrumbs=====START */}
      <nav className="breadcrumb">
        <a href="/" className="breadcrumb-item">
          <FontAwesomeIcon icon={faHouse} className="icon" />
          {t('breadcrumb.home')}
        </a>
        <span className="breadcrumb-separator"> &gt; </span>
        <span className="breadcrumb-current">{t('gift.title')}</span>
      </nav>
      {/* =====Breadcrumbs=====END */}

      <h1 className="gift__title">{t('gift.title')}</h1>

      {error ? (
        <div className="error-message">
          <p>
            {t('gift.error')}: {error}
          </p>
          <button className="btn--retry" onClick={fetchGiftPacks}>
            {t('gift.tryAgain')}
          </button>
        </div>
      ) : (
        <>
          <div className="gift-list">
            {giftPacks.map((pack) => {
              const expired = new Date() > new Date(pack.endDate)
              const claimed = claimedPacks.includes(pack.id)

              return (
                <div className="gift-item" key={pack.id}>
                  <div className="gift-item__content">
                    <figure className="gift-item__avatar">
                      <img src={pack.image} alt="icon" className="avatar" />
                    </figure>
                    <div className="gift-item__info">
                      <h2 className="gift-item__info-title">{pack.title}</h2>
                      <p className="gift-item__info-text">{pack.content}</p>
                      <p className="gift-item__info-text">
                        有效期限：{pack.startDate} ~ {pack.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="btn-box">
                    <button
                      disabled={expired}
                      onClick={() => handleClaim(pack.id)}
                      className="btn--withdraw"
                    >
                      {expired ? t('gift.expired') : t('gift.receive')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 分頁區塊 */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="btn--page btn--extrem"
            >
              {t('pagination.firstPage')}
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn--page"
            >
              {t('pagination.prevPage')}
            </button>

            <div className="page-select">
              <span className="page-select__text">{t('pagination.the')}</span>
              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="page-select__select"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span className="page-select__text">
                {t('pagination.page')} / {t('pagination.total')} {totalPages}{' '}
                {t('pagination.page')}
              </span>
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="btn--page"
            >
              {t('pagination.nextPage')}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="btn--page btn--extrem"
            >
              {t('pagination.lastPage')}
            </button>
          </div>
        </>
      )}

      {/* 成功領取彈窗 */}
      <AnimatePresence>
        {showSuccessModal && (
          <GiftSuccessModal
            code={claimedCode}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default GiftPackPage
