import React from 'react'
import {useState, useEffect} from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink,
    Redirect,
    useLocation
} from 'react-router-dom'

import {NotificationContainer, NotificationManager} from 'react-notifications'

import {LazyLoadImage} from 'react-lazy-load-image-component'

import InputMask from 'react-input-mask'
import Modal from 'react-modal'

import $ from 'jquery'

import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/swiper-bundle.min.css'

import 'react-notifications/lib/notifications.css'

import './App.css'

const apiKey = '3c0d4811f72089fdd67d6ec69ad06889fb03b88a'
const apiUrl = 'https://xn--80aqu.xn----7sbbncf3d.xn--p1ai'

Modal.setAppElement('#root')

const reviewBreakpoints = {
    320: {
        slidesPerView: 1.5,
        spaceBetween: 20
    },
    768: {
        slidesPerView: 4,
        spaceBetween: 20
    }
}

const catalogBreakpoints = {
    320: {
        slidesPerView: 1.5,
        spaceBetween: 30
    },
    768: {
        slidesPerView: 3.5,
        spaceBetween: 30
    }
}

export default function App() {
    const [userAuthorized, setUserAuthorized] = useState(false)
    const [info, setInfo] = useState(null)
    const [offer, setOffer] = useState(null)
    const [politics, setPolitics] = useState(null)

    useEffect(() => {
        if (sessionStorage.getItem('userHash')) {
            fetch(apiUrl + '/api/v1/get/auth', {
                method: 'get',
                mode: 'cors',
                headers: {
                    'authorization': apiKey,
                    'user-hash': sessionStorage.getItem('userHash')
                }
            })
                .then(response => {
                    response.json().then(json => {
                        if (json.success) {
                            if (json.data) {
                                setUserAuthorized(true)
                            }
                        }
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        }

        let isInfo = true

        fetch(apiUrl + '/api/v1/get/settings', {
            method: 'get',
            cors: 'cors',
            headers: {
                'authorization': apiKey
            }
        })
            .then(response => {
                response.json().then(json => {
                    if (json.success) {
                        isInfo ? setInfo(json) : setInfo(null)
                        if (isInfo) {
                            for (let doc of json.data.contacts.docs) {
                                if (doc.name === '????????????') {
                                    setOffer(doc.value)
                                } else if (doc.name === '???????????????? ????????????????????????????????????') {
                                    setPolitics(doc.value)
                                }
                            }
                        }
                    }
                })
            })

        return () => (isInfo = false)
    }, [])

    const callMe = e => {
        e.preventDefault()

        fetch(apiUrl + '/api/v1/post/requests', {
            method: 'post',
            mode: 'cors',
            headers: {
                'authorization': apiKey
            },
            body: new FormData(e.target)
        })
            .then(response => {
                response.json().then(json => {
                    if (json.success) {
                        NotificationManager.success('???????????? ????????????????????!', '??????????')
                    } else {
                        var response = json.data;
                        $.each(response, function (key, value) {
                            NotificationManager.error(value + '' +
                                '', '????????????!');
                        });
                    }
                })
            })
            .catch(error => {
                NotificationManager.error('???????????? ??????????????! ????????????????????, ???????????????????? ??????????', '????????????!');
            })
    }

    function Header() {
        let currentLocation = useLocation()
        const [modalIsOpen, setIsOpen] = useState(false)
        const [menuIsOpen, setMenuIsOpen] = useState(false)

        const openModal = () => {
            setMenuIsOpen(false)
            setIsOpen(true)
        }

        const closeModal = () => {
            setIsOpen(false)
        }

        const openMenu = () => {
            setMenuIsOpen(true)
        }

        const closeMenu = () => {
            setMenuIsOpen(false)
        }

        const ProfileLink = () => {
            if (userAuthorized) {
                return (
                    <Link to='/profile/'>???????????? ??????????????</Link>
                )
            } else {
                return (
                    <Link to='/auth/'>??????????</Link>
                )
            }
        }

        if (currentLocation.pathname === '/') {
            if (info === null) {
                return (
                    <main>
                        <section className='m-section'/>
                    </main>
                )
            } else {
                const props = {
                    checked: true
                }

                return (
                    <header>
                        <div id='l-personalPanel'>
                            <span>???????????????????? ????????????: <a
                                href={('mailto:' + info.data.contacts.email)}>{info.data.contacts.email}</a></span>
                            <ProfileLink/>
                        </div>
                        <div id='l-menuPanel'>
                            <Link to='/'>
                                <LazyLoadImage src={info.data.contacts.logo} className="m-logoImg" alt="?????????????? ????????????????"/>
                            </Link>
                            <nav>
                                <a href='#l-catalog'>????????</a>
                                <a href='#l-delivery'>???????????? ?? ????????????????</a>
                                <a href='#l-about'>?? ??????</a>
                            </nav>
                            <div id='l-headerTimeAndTel'>
                                <span>{info.data.contacts.timework}</span>
                                <article>
                                    <a className='t-bigTel'
                                       href={('tel:' + info.data.contacts.phone)}>{info.data.contacts.phone}</a>
                                    <button className='m-linkButton' onClick={openModal}>?????????????????????? ??????</button>
                                    <Modal isOpen={modalIsOpen} onRequestClose={closeModal}
                                           overlayClassName='m-modalOverlay' className='m-modal'>
                                        <button className='m-linkButton m-closeModalButton'
                                                onClick={closeModal}>&#10006;</button>
                                        <h2>???????????????? ???????????????? ????????????</h2>
                                        <form id='l-modalCallback' onSubmit={callMe}>
                                            <input type='hidden' name='RequestForm[type]' value='callback'/>
                                            <article>
                                                <input type='text' name='RequestForm[name]' placeholder='??????'/>
                                            </article>
                                            <article>
                                                <InputMask mask='+7 (999) 999-9999' maskChar='_' alwaysShowMask='true'>
                                                    {(inputProps) => <input type='tel' name='RequestForm[phone]'/>}
                                                </InputMask>
                                            </article>
                                            <article>
                                                <div className='m-checkboxInput'>
                                                    <input type='checkbox' name='RequestForm[agreement]' id='agreement'
                                                           checked={props.checked} onChange={() => {
                                                    }}/>
                                                    <label htmlFor='agreement'>
                                                        <a href={politics} target='_blank' rel='noreferrer'>????????????????
                                                            ????????????????????????????????????</a>
                                                    </label>
                                                </div>
                                            </article>
                                            <button type='submit'>??????????????????</button>
                                        </form>
                                    </Modal>
                                </article>
                            </div>
                        </div>
                        <div id='l-mobileHeader'>
                            <Link to='/'>
                                <LazyLoadImage src={info.data.contacts.logo} className="m-logoImg" alt="?????????????? ????????????????"/>
                            </Link>
                            <article>
                                <a className='t-bigTel'
                                   href={('tel:' + info.data.contacts.phone)}>{info.data.contacts.phone}</a>
                                <span>{info.data.contacts.timework}</span>
                            </article>
                            <button onClick={openMenu}>&#9776;</button>
                            <Modal isOpen={menuIsOpen} onRequestClose={closeMenu} overlayClassName='m-modalOverlay'
                                   className='m-modalMenu'>
                                <button className='m-linkButton m-closeModalButton'
                                        onClick={closeMenu}>&#10006;</button>
                                <article>
                                    <ProfileLink/>
                                    <a onClick={closeMenu} href='#l-catalog'>????????</a>
                                    <a onClick={closeMenu} href='#l-delivery'>???????????? ?? ????????????????</a>
                                    <a onClick={closeMenu} href='#l-about'>?? ??????</a>
                                    <button onClick={openModal}>????????????????</button>
                                </article>
                            </Modal>
                        </div>
                    </header>
                )
            }
        } else {
            if (info === null) {
                return (
                    <main>
                        <section className='m-section'/>
                    </main>
                )
            } else {
                return (
                    <header>
                        <div id='l-menuInnerPanel'>
                            <Link to='/'>&lt; ??????????????</Link>
                            <Link to='/'>
                                <LazyLoadImage src={info.data.contacts.logo} className="m-logoImg" alt="?????????????? ????????????????"/>
                            </Link>
                        </div>
                    </header>
                )
            }
        }
    }

    function Footer() {
        if (info === null) {
            return (
                <main>
                    <section className='m-section'/>
                </main>
            )
        } else {
            let card = {__html: info.data.contacts.card}

            return (
                <footer>
                    <div>
                        <Link to='/'>
                            <LazyLoadImage src={info.data.contacts.logo} className="m-logoImg" alt="?????????????? ????????????????"/>
                        </Link>
                        <div id='l-contacts'>
                            <h2 className='t-dark'>???????? ????????????????:</h2>
                            <span className='t-light'>
								<a href={('tel:' + info.data.contacts.phone)}>{info.data.contacts.phone}</a>
							</span>
                            <span className='t-dark'>
								{info.data.contacts.adress}
							</span>
                        </div>
                        <div id='l-copyright'>
							<span className='t-dark'>
								{info.data.contacts.copy}
							</span>
                            {info.data.contacts.docs.map((value, key) => (
                                <span className='t-light' key={key}>
									<a href={value.value} target='_blank' rel='noreferrer'>{value.name}</a>
								</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div id='l-footerSocialLinks'>
                            {info.data.contacts.socialnyeSeti.map((value, key) => (
                                <a key={key} href={value.prompt} target='_blank' rel='noreferrer'>
                                    <LazyLoadImage src={value.value} alt={value.name}/>
                                </a>
                            ))}
                        </div>
                        <div id='l-footerInfo'>
                            <span className='t-dark t-uppercase' dangerouslySetInnerHTML={card}/>
                        </div>
                    </div>
                </footer>
            )
        }
    }

    function AccordeonItem(props) {
        const [open, setOpen] = useState('s-closed')
        const [minus, setminus] = useState('m-plus')

        const openDesc = () => {
            if (open === 's-closed') {
                setOpen('s-opened')
                setminus('m-minus')
            } else {
                setOpen('s-closed')
                setminus('m-plus')
            }
        }

        return (
            <div className='m-accordeonItem'>
                <button onClick={openDesc}>
                    {props.name}
                    <span className={minus}>
						<img src='/img/minus.svg' alt='#'/>
						<img src='/img/minus.svg' alt='#'/>
					</span>
                </button>
                <article className={open}>{props.desc}</article>
            </div>
        )
    }

    function HiddenText(props) {
        const [open, setOpen] = useState('s-closed')
        const [text, setText] = useState('??????????????????')
        let fullText = {__html: props.text}

        const openText = () => {
            if (open === 's-closed') {
                setOpen('s-opened')
                setText('????????????????')
            } else {
                setOpen('s-closed')
                setText('??????????????????')
            }
        }

        return (
            <div>
                <div className={open} dangerouslySetInnerHTML={fullText}></div>
                <button className='m-linkButton' onClick={openText}>{text}</button>
            </div>
        )
    }

    function Catalog() {
        const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)
        const [quickOpen, setQuickOpen] = useState(false)
        const [selectOpen, setSelectOpen] = useState('s-closed')
        const [basketWeek, setBasketWeek] = useState('week1')
        const [basketSize, setBasketSize] = useState('xs')
        const [basketDays, setBasketDays] = useState('1 ????????')
        const [basketSumm, setBasketSumm] = useState('0')
        const [catalog, setCatalog] = useState(null)

        sessionStorage.setItem('days', basketDays)
        sessionStorage.setItem('size', basketSize)

        useEffect(() => {
            let isCatalog = true

            fetch(apiUrl + '/api/v1/get/catalog?size=' + basketSize + '&week=' + basketWeek, {
                method: 'get',
                mode: 'cors',
                headers: {
                    'authorization': apiKey
                }
            })
                .then(response => {
                    response.json().then(json => {
                        if (json.success) {
                            isCatalog ? setCatalog(json) : setCatalog(null)
                            isCatalog ? setBasketSumm(Number(json.data.price).toString(10)) : setBasketSumm('0')
                            sessionStorage.setItem('summ', (Number(json.data.price)).toString(10))
                        }
                    })
                })
                .catch(error => {
                    NotificationManager.error('???????????? ??????????????! ????????????????????, ???????????????????? ??????????', '????????????!');
                })

            return () => (isCatalog = false)
        }, [basketSize, basketWeek])

        const openPurchaseModal = () => {
            setPurchaseModalOpen(true)
        }

        const closePurchaseModal = () => {
            setPurchaseModalOpen(false)
        }

        const openQuick = () => {
            setPurchaseModalOpen(false)
            setQuickOpen(true)
        }

        const closeQuick = () => {
            setQuickOpen(false)
        }

        const toggleSelect = () => {
            if (selectOpen === 's-closed') {
                setSelectOpen('s-opened')
            } else {
                setSelectOpen('s-closed')
            }
        }

        const changeSelect = e => {
            let summary = Number(e.target.dataset.multiplier) * Number(catalog.data.price)

            setBasketDays(e.target.dataset.id)
            sessionStorage.setItem('days', e.target.dataset.id)
            switch (e.target.dataset.multiplier) {
                case '14':
                    setBasketSumm(Math.ceil(summary - summary * 0.05).toString(10))
                    sessionStorage.setItem('summ', Math.ceil(summary - summary * 0.05).toString(10))
                    break
                case '21':
                    setBasketSumm(Math.ceil(summary - summary * 0.07).toString(10))
                    sessionStorage.setItem('summ', Math.ceil(summary - summary * 0.07).toString(10))
                    break
                case '28':
                    setBasketSumm(Math.ceil(summary - summary * 0.09).toString(10))
                    sessionStorage.setItem('summ', Math.ceil(summary - summary * 0.09).toString(10))
                    break
                default:
                    setBasketSumm(Math.ceil(summary).toString(10))
                    sessionStorage.setItem('summ', Math.ceil(summary).toString(10))
            }
            toggleSelect()
        }

        const changeSize = e => {
            setBasketSize(e.target.dataset.size)
            sessionStorage.setItem('size', e.target.dataset.size)

        }

        const changeWeek = e => {
            setBasketWeek(e.target.dataset.week)
        }

        const quick = e => {
            e.preventDefault()

            fetch(apiUrl + '/api/v1/post/orders?type=quickly', {
                method: 'post',
                mode: 'cors',
                headers: {
                    'authorization': apiKey
                },
                body: new FormData(e.target)
            })
                .then(response => {
                    response.json().then(json => {
                        if (json.success) {
                            NotificationManager.success('???????????? ????????????????????!', '??????????')
                        } else {
                            var response = json.data;
                            $.each(response, function (key, value) {
                                NotificationManager.error(value + '' +
                                    '', '????????????!');
                            });
                        }
                    })
                })
                .catch(error => {
                    NotificationManager.error('???????????? ??????????????! ????????????????????, ???????????????????? ??????????', '????????????!');
                })
        }

        if (catalog === null) {
            return (
                <h2 className='s-center'>????????????????...</h2>
            )
        } else {
            const props = {
                checked: true
            }

            return (
                <div id='l-catalog'>
                    <div className='m-catalogBlock'>
                        <h3>???????????????? ???????????? ??????????????:</h3>
                        <div className='m-catalogButtons'>
                            <button data-size='xs' onClick={changeSize} className={basketSize === 'xs' ? 'active' : ''}>XS</button>
                            <button data-size='m' onClick={changeSize} className={basketSize === 'm' ? 'active' : ''}>M</button>
                            <button data-size='xl' onClick={changeSize} className={basketSize === 'xl' ? 'active' : ''}>XL</button>
                        </div>
                    </div>
                    <div className='m-catalogBlock'>
                        <h3>?????????????????? ???????? ???? ????????????:</h3>
                        <div className='m-catalogButtons'>
                            <button className={basketWeek === 'week1' ? 'active' : ''} data-week='week1' onClick={changeWeek}><span
                                data-week='week1'>??????????????????????</span><span data-week='week1'>????</span></button>
                            <button className={basketWeek === 'week2' ? 'active' : ''} data-week='week2' onClick={changeWeek}><span data-week='week2'>??????????????</span><span
                                data-week='week2'>????</span></button>
                            <button className={basketWeek === 'week3' ? 'active' : ''} data-week='week3' onClick={changeWeek}><span data-week='week3'>??????????</span><span
                                data-week='week3'>????</span></button>
                            <button className={basketWeek === 'week4' ? 'active' : ''} data-week='week4' onClick={changeWeek}><span data-week='week4'>??????????????</span><span
                                data-week='week4'>????</span></button>
                            <button className={basketWeek === 'week5' ? 'active' : ''} data-week='week5' onClick={changeWeek}><span data-week='week5'>??????????????</span><span
                                data-week='week5'>????</span></button>
                            <button className={basketWeek === 'week6' ? 'active' : ''} data-week='week6' onClick={changeWeek}><span data-week='week6'>??????????????</span><span
                                data-week='week6'>????</span></button>
                            <button className={basketWeek === 'week0' ? 'active' : ''} data-week='week0' onClick={changeWeek}><span
                                data-week='week0'>??????????????????????</span><span data-week='week0'>????</span></button>
                        </div>
                        <div id='l-catalogSlider'>
                            <Swiper breakpoints={catalogBreakpoints}>
                                {catalog.data.list.map((value, key) => (
                                    <SwiperSlide key={key}>
                                        <LazyLoadImage src={value.img} alt={value.name}/>
                                        <span>{value.name}</span>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                    <div id='l-catalogTotal' className='m-catalogBlock'>
                        <div id='l-catalogPurchase'>
                            <button onClick={openPurchaseModal}>????????????????</button>
                            <Modal isOpen={purchaseModalOpen} onRequestClose={closePurchaseModal}
                                   overlayClassName='m-modalOverlay' className='m-modal'>
                                <button className='m-linkButton m-closeModalButton'
                                        onClick={closePurchaseModal}>&#10006;</button>
                                <h2>???????????????????? ????????????</h2>
                                <form id='l-modalCallback'>
                                    <article>
                                        <span>???????????????? ?????????????? ?????? ?????? ????????????:</span>
                                    </article>
                                    <article>
                                        <button onClick={openQuick}>???????????????????? ??????????</button>
                                    </article>
                                    <article>
                                        <Link to='/basket/' className='m-buttonLink'>???????????????? ???? ??????????</Link>
                                    </article>
                                </form>
                            </Modal>
                            <Modal isOpen={quickOpen} onRequestClose={closeQuick} overlayClassName='m-modalOverlay'
                                   className='m-modal'>
                                <button className='m-linkButton m-closeModalButton'
                                        onClick={closeQuick}>&#10006;</button>
                                <h2>???????????????????? ??????????</h2>
                                <form id='l-modalCallback' onSubmit={quick}>
                                    <input type='hidden' name='QuicklyForm[size]' value={basketSize}/>
                                    <input type='hidden' name='QuicklyForm[summ]' value={basketSumm}/>
                                    <input type='hidden' name='QuicklyForm[day]' value={basketDays}/>
                                    <article>
                                        <input type='text' name='QuicklyForm[name]' placeholder='??????'/>
                                    </article>
                                    <article>
                                        <InputMask mask='+7 (999) 999-9999' maskChar='_' alwaysShowMask='true'>
                                            {(inputProps) => <input type='tel' name='QuicklyForm[phone]'/>}
                                        </InputMask>
                                    </article>
                                    <article>
                                        <div className='m-checkboxInput'>
                                            <input type='checkbox' name='RequestForm[agreement]' id='agreement'
                                                   checked={props.checked} onChange={() => {
                                            }}/>
                                            <label htmlFor='agreement'>
                                                <a href={politics} target='_blank' rel='noreferrer'>????????????????
                                                    ????????????????????????????????????</a>
                                            </label>
                                        </div>
                                    </article>
                                    <button type='submit'>??????????????????</button>
                                </form>
                            </Modal>
                        </div>
                        <div id='l-catalogPrice'>
                            <h3>??????????:</h3>
                            <p>{basketSumm}??</p>
                        </div>
                        <div id='l-catalogDuration'>
                            <h3>???????????????? ??????????????????????????????????:</h3>
                            <div className='m-select'>
                                <article className={selectOpen}>
                                    <span data-id='1 ????????' data-multiplier='1'
                                          onClick={changeSelect}>1 ????????: {catalog.data.price}?? ?? ????????</span>
                                    <span data-id='7 ????????' data-multiplier='7'
                                          onClick={changeSelect}>7 ????????: {catalog.data.price}?? ?? ????????</span>
                                    <span data-id='14 ????????' data-multiplier='14'
                                          onClick={changeSelect}>14 ????????: {catalog.data.price}?? ?? ????????</span>
                                    <span data-id='21 ????????' data-multiplier='21'
                                          onClick={changeSelect}>21 ????????: {catalog.data.price}?? ?? ????????</span>
                                    <span data-id='28 ????????' data-multiplier='28'
                                          onClick={changeSelect}>28 ????????: {catalog.data.price}?? ?? ????????</span>
                                </article>
                                <button onClick={toggleSelect}>{basketDays}: {catalog.data.price}?? ?? ???????? <img
                                    src='/img/arrow.svg' alt='#' width="15" height="15"/></button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    function Mainpage() {
        const [modalIsOpen, setIsOpen] = useState(false)

        const openModal = () => {
            setIsOpen(true)
        }

        const closeModal = () => {
            setIsOpen(false)
        }

        if (info === null) {
            return (
                <main>
                    <section className='m-section'>
                        <h2 className='s-center'>????????????????...</h2>
                    </section>
                </main>
            )
        } else {
            const props = {
                checked: true
            }

            return (
                <main>
                    <section id='l-banner' className='m-section'>
                        <h1>{info.data.hero.title}</h1>
                        <ul>
                            {info.data.hero.preimushchestva.map((value, key) => (
                                <li key={key}>
                                    <span>{value.value}<span>{value.prompt}</span></span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={openModal}>???????????????????? ?????? ??????</button>
                        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} overlayClassName='m-modalOverlay'
                               className='m-modal'>
                            <button className='m-linkButton m-closeModalButton' onClick={closeModal}>&#10006;</button>
                            <h2>???????????????? ???????????????? ????????????</h2>
                            <form id='l-modalCallback' onSubmit={callMe}>
                                <input type='hidden' name='RequestForm[type]' value='callback'/>
                                <article>
                                    <input type='text' name='RequestForm[name]' placeholder='??????'/>
                                </article>
                                <article>
                                    <InputMask mask='+7 (999) 999-9999' maskChar='_' alwaysShowMask='true'>
                                        {(inputProps) => <input type='tel' name='RequestForm[phone]'/>}
                                    </InputMask>
                                </article>
                                <article>
                                    <div className='m-checkboxInput'>
                                        <input type='checkbox' name='RequestForm[agreement]' id='agreement' checked={props.checked} onChange={() => {
                                        }}/>
                                        <label htmlFor='agreement'>
                                            <a href={politics} target='_blank' rel='noreferrer'>????????????????
                                                ????????????????????????????????????</a>
                                        </label>
                                    </div>
                                </article>
                                <button type='submit'>??????????????????</button>
                            </form>
                        </Modal>
                    </section>
                    <section className='m-section t-darkBackground'>
                        <div className='m-slider t-staticSlider'>
                            {info.data.advantages.advantages.map((value, key) => (
                                <article key={key}>
                                    <LazyLoadImage src={value.value} alt={value.name} width="60" height="60"/>
                                    <h3>{value.name}</h3>
                                    <hr/>
                                    <p>{value.prompt}</p>
                                </article>
                            ))}
                        </div>
                        <div className='m-slider t-dynamicSlider'>
                            <Swiper spaceBetween={50} slidesPerView={1.5}>
                                {info.data.advantages.advantages.map((value, key) => (
                                    <SwiperSlide key={key}>
                                        <article>
                                            <LazyLoadImage src={value.value} alt={value.name} width="60" height="60"/>
                                            <h3>{value.name}</h3>
                                            <hr/>
                                            <p>{value.prompt}</p>
                                        </article>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </section>
                    <section className='m-section'>
                        <Catalog/>
                    </section>
                    <section className='t-grey m-section'>
                        <div className='m-twoColumns'>
                            <article>
                                <h2>{info.data.cook.title}</h2>
                                <p>{info.data.cook.descr}</p>
                            </article>
                            <article>
                                <LazyLoadImage src={info.data.cook.img} alt="#"/>
                            </article>
                        </div>
                    </section>
                    <section id='l-delivery' className='m-section t-darkBackground'>
                        <h2>???????????? ?? ????????????????</h2>
                        <div className='m-slider t-staticSlider'>
                            {info.data.delivery.delivery.map((value, key) => (
                                <article key={key}>
                                    <LazyLoadImage src={value.value} alt={value.name} width="60" height="60"/>
                                    <h3>{value.name}</h3>
                                    <hr/>
                                    <p>{value.prompt}</p>
                                </article>
                            ))}
                        </div>
                        <div className='m-slider t-dynamicSlider'>
                            <Swiper spaceBetween={50} slidesPerView={1.5}>
                                {info.data.delivery.delivery.map((value, key) => (
                                    <SwiperSlide key={key}>
                                        <article>
                                            <LazyLoadImage src={value.value} alt={value.name} width="60" height="60"/>
                                            <h3>{value.name}</h3>
                                            <hr/>
                                            <p>{value.prompt}</p>
                                        </article>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </section>
                    <section className='t-grey m-section'>
                        <div className='m-twoColumns'>
                            <article>
                                <h2>{info.data.questions.title}</h2>
                                <p>{info.data.questions.descr}</p>
                                <p>???????????????? ???????????????</p>
                                <button onClick={openModal}>???????????????? ????????????????????????</button>
                            </article>
                            <article>
                                {info.data.questions.questions.map((value, key) => (
                                    <AccordeonItem key={key} name={value.value} desc={value.prompt}/>
                                ))}
                            </article>
                        </div>
                    </section>
                    <section className='m-section'>
                        <h2>????????????</h2>
                        <Swiper breakpoints={reviewBreakpoints}>
                            {info.data.reviews.reviews.map((value, key) => (
                                <SwiperSlide key={key}>
                                    <LazyLoadImage src={value.value} alt={value.name}/>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </section>
                    <section className='t-grey m-section'>
                        <div id='l-subscribe'>
                            <article>
                                <h2>{info.data.social.title}</h2>
                                <p>{info.data.social.descr}</p>
                            </article>
                            <article>
                                {info.data.social.list.map((value, key) => (
                                    <a key={key} href={value.prompt} target='_blank' rel='noreferrer'>
                                        <LazyLoadImage src={value.value} alt={value.name}/>
                                    </a>
                                ))}
                            </article>
                        </div>
                    </section>
                    <section id='l-about' className='m-section'>
                        <h3>{info.data.about.title}</h3>
                        <p>{info.data.about.descr}</p>
                        <HiddenText text={info.data.about.descrAll}/>
                    </section>
                </main>
            )
        }
    }

    function Auth() {
        const [telInput, setTelInput] = useState('tel')
        const [codeInput, setCodeInput] = useState('hidden')
        const [timerButtonClass, setTimerButtonClass] = useState('s-hidden')
        const [counter, setCounter] = useState(0)
        const [continueButton, setContinueButton] = useState('submit')

        const formatTime = time => {
            const minutes = Math.floor(time / 60)
            const seconds = time % 60
            return `${minutes}:${String(seconds).length === 1 ? `0${seconds}` : `${seconds}`}`
        }

        useEffect(() => {
            let timer

            if (counter > 0) {
                timer = setTimeout(() => setCounter(c => c - 1), 1000)
            }

            return () => {
                if (timer) {
                    clearTimeout(timer)
                }
            }
        }, [counter])

        const codeChanged = e => {
            const regEx = /\d{4}/
            if (regEx.test(e.target.value)) {
                setContinueButton('submit')
            } else {
                setContinueButton('button')
            }
        }

        const authorization = e => {
            e.preventDefault()

            fetch(apiUrl + '/api/v1/post/auth', {
                method: 'post',
                mode: 'cors',
                headers: {
                    'authorization': apiKey
                },
                body: new FormData(e.target)
            })
                .then(response => {
                    if (response.ok) {
                        response.json().then(json => {
                            if (json.success) {
                                if (json.data.event === 'code') {
                                    setTelInput('hidden')
                                    setCodeInput('text')
                                    setTimerButtonClass('t-timerButton')
                                    setCounter(300)
                                    setContinueButton('button')
                                } else if (json.data.event === 'auth') {
                                    sessionStorage.setItem('userHash', json.data.hash)
                                    setUserAuthorized(true)
                                }
                            }
                        })
                    } else {
                        NotificationManager.error('???????????? ??????????????! ????????????????????, ???????????????????? ??????????', '????????????!');
                    }
                })
                .catch(error => {
                    NotificationManager.error('???????????? ??????????????! ????????????????????, ???????????????????? ??????????', '????????????!');
                })
        }

        if (userAuthorized) {
            return (
                <Redirect to='/profile/'/>
            )
        } else {
            return (
                <main>
                    <section className='m-section'>
                        <h1>?????? ??????????????</h1>
                        <form id='l-authForm' onSubmit={authorization}>
                            <InputMask mask='+7 (999) 999-9999' maskChar='_' alwaysShowMask='true'>
                                {(inputProps) => <input type={telInput} name='AuthForm[phone]'/>}
                            </InputMask>
                            <InputMask mask='9999' maskChar='_' alwaysShowMask='true' onChange={codeChanged}>
                                {(inputProps) => <input type={codeInput} name='AuthForm[code]'/>}
                            </InputMask>
                            <button className={timerButtonClass} type={counter === 0 ? 'submit' : 'button'}>??????????????????
                                ???????????????? ({formatTime(counter)})
                            </button>
                            <span>
								?????????????? ???????????? ????????????????????????, ???? ???????????????????????? ?? ?????????????????? <a href={offer} target='_blank'
                                                                                            rel='noreferrer'>????????????</a> ?? ?????????? ???????????????? ???? ?????????????????? <a
                                href={politics} target='_blank' rel='noreferrer'>???????????????????????? ????????????</a>
							</span>
                            <button type={continueButton}>????????????????????</button>
                        </form>
                    </section>
                </main>
            )
        }
    }

    function ProfileLinks() {
        return (
            <div id='l-profileLinks'>
                <NavLink to='/profile/' activeClassName='active'>??????????????</NavLink>
                <NavLink to='/orders/' activeClassName='active'>????????????</NavLink>
            </div>
        )
    }

    function Profile() {
        const [items, setItems] = useState(null)
        const [modalIsOpen, setIsOpen] = useState(false)
        const [addressChanged, setAddressChanged] = useState(0)

        useEffect(() => {
            let isItems = true

            fetch(apiUrl + '/api/v1/get/user', {
                method: 'get',
                mode: 'cors',
                headers: {
                    'authorization': apiKey,
                    'user-hash': sessionStorage.getItem('userHash')
                }
            })
                .then(response => {
                    response.json().then(json => {
                        if (json.success) {
                            isItems ? setItems(json) : setItems(null)
                        }
                    })
                })
                .catch(error => {
                    NotificationManager.error('???????????? ??????????????! ????????????????????, ???????????????????? ??????????', '????????????!');
                })

            return () => (isItems = false)
        }, [addressChanged])

        const logout = () => {
            fetch(apiUrl + '/api/v1/get/auth?type=exit', {
                method: 'get',
                mode: 'cors',
                headers: {
                    'authorization': apiKey,
                    'user-hash': sessionStorage.getItem('userHash')
                }
            })
                .then(response => {
                    response.json().then(json => {
                        if (json.success) {
                            sessionStorage.removeItem('userHash')
                            setUserAuthorized(false)
                        }
                    })
                })
                .catch(error => {
                    NotificationManager.error('???????????? ??????????????! ????????????????????, ???????????????????? ??????????', '????????????!');
                })
        }

        const openModal = () => {
            setIsOpen(true)
        }

        const closeModal = () => {
            setIsOpen(false)
        }

        const editInfo = e => {
            e.preventDefault()

            fetch(apiUrl + '/api/v1/post/update?type=user', {
                method: 'post',
                mode: 'cors',
                headers: {
                    'authorization': apiKey,
                    'user-hash': sessionStorage.getItem('userHash')
                },
                body: new FormData(e.target)
            })
                .then(response => {
                    response.json().then(json => {
                        if (json.success) {
                            NotificationManager.success('???????????? ?????????????? ??????????????????!', '??????????')
                        } else {
                            var response = json.data;
                            $.each(response, function (key, value) {
                                NotificationManager.error(value + '' +
                                    '', '????????????!');
                            });
                        }
                    })
                })
                .catch(error => {
                    NotificationManager.error('???????????? ??????????????! ????????????????????, ???????????????????? ??????????', '????????????!');
                })
        }

        const addAddress = e => {
            e.preventDefault()

            fetch(apiUrl + '/api/v1/post/address', {
                method: 'post',
                mode: 'cors',
                headers: {
                    'authorization': apiKey,
                    'user-hash': sessionStorage.getItem('userHash')
                },
                body: new FormData(e.target)
            })
                .then(response => {
                    response.json().then(json => {
                        if (json.success) {
                            setAddressChanged(addressChanged + 1)
                            closeModal()
                        } else {
                            var response = json.data;
                            $.each(response, function (key, value) {
                                NotificationManager.error(value + '' +
                                    '', '????????????!');
                            });
                        }
                    })
                })
                .catch(error => {
                    NotificationManager.error('???????????? ??????????????! ????????????????????, ???????????????????? ??????????', '????????????!');
                })
        }

        const deleteAddress = e => {
            fetch(apiUrl + '/api/v1/get/address?id=' + e.target.dataset.id, {
                method: 'get',
                mode: 'cors',
                headers: {
                    'authorization': apiKey,
                    'user-hash': sessionStorage.getItem('userHash')
                }
            })
                .then(response => {
                    response.json().then(json => {
                        if (json.success) {
                            setAddressChanged(addressChanged + 1)
                        }
                    })
                })
                .catch(error => {
                    NotificationManager.error('???????????? ??????????????! ????????????????????, ???????????????????? ??????????', '????????????!');
                })
        }

        function GenderInputs(props) {
            let male = false
            let female = false

            if (props.gender === 'm') {
                male = true
            } else if (props.gender === 'f') {
                female = true
            }

            return (
                <article>
                    <p>??????</p>
                    <div className='m-radioInput'>
                        <input type='radio' name='UserForm[gender]' value='m' id='male' defaultChecked={male}/>
                        <label htmlFor='male'>??????????????</label>
                    </div>
                    <div className='m-radioInput'>
                        <input type='radio' name='UserForm[gender]' value='f' id='female' defaultChecked={female}/>
                        <label htmlFor='female'>??????????????</label>
                    </div>
                </article>
            )
        }

        if (!userAuthorized) {
            return (
                <Redirect to='/auth/'/>
            )
        } else if (items === null) {
            return (
                <main>
                    <section className='m-section'>
                        <h2 className='s-center'>????????????????...</h2>
                    </section>
                </main>
            )
        } else {
            return (
                <main>
                    <section className='m-section'>
                        <ProfileLinks/>
                        <div id='l-personal'>
                            <form id='l-personalInfo' onSubmit={editInfo}>
                                <h2>+{items.data.user.user_phone}</h2>
                                <article>
                                    <input type='text' name='UserForm[name]' placeholder='??????'
                                           defaultValue={items.data.user.user_name}/>
                                </article>
                                <article>
                                    <input type='email' name='UserForm[email]' placeholder='E-mail'
                                           defaultValue={items.data.user.user_email}/>
                                </article>
                                <article>
                                    <InputMask mask='99.99.9999' maskChar='_' alwaysShowMask='false'
                                               value={items.data.user.user_birthday}>
                                        {(inputProps) => <input type='text' name='UserForm[birthday]'
                                                                placeholder='???????? ????????????????'/>}
                                    </InputMask>
                                </article>
                                <GenderInputs gender={items.data.user.user_gender}/>
                                <button type='submit'>??????????????????</button>
                                <button type='button' onClick={logout}>??????????</button>
                            </form>
                            <div id='l-personalAddresses'>
                                <h3>?????? ????????????</h3>
                                <button className='m-linkButton' onClick={openModal}>???????????????? ??????????</button>
                                <Modal isOpen={modalIsOpen} onRequestClose={closeModal}
                                       overlayClassName='m-modalOverlay' className='m-modal'>
                                    <button className='m-linkButton m-closeModalButton'
                                            onClick={closeModal}>&#10006;</button>
                                    <h2>???????????????? ?????????? ??????????</h2>
                                    <form id='l-modalAddressForm' onSubmit={addAddress}>
                                        <article>
                                            <input type='text' name='AddressForm[name]' placeholder='????????????????'/>
                                        </article>
                                        <article>
                                            <input type='text' name='AddressForm[address]' placeholder='??????????'/>
                                        </article>
                                        <article>
                                            <input type='text' name='AddressForm[driveway]' placeholder='??????????????'/>
                                        </article>
                                        <article>
                                            <input type='text' name='AddressForm[apartment]' placeholder='????????????????'/>
                                        </article>
                                        <article>
                                            <input type='text' name='AddressForm[intercom]' placeholder='??????????????'/>
                                        </article>
                                        <article>
                                            <input type='text' name='AddressForm[story]' placeholder='????????'/>
                                        </article>
                                        <button type='submit'>??????????????????</button>
                                    </form>
                                </Modal>
                                {items.data.address.map(address => (
                                    <article key={address.id}>
                                        <p><span>{address.name}: </span>{address.address}</p>
                                        <button className='m-linkButton' data-id={address.id}
                                                onClick={deleteAddress}>??????????????
                                        </button>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            )
        }
    }

    function Orders() {
        const [items, setItems] = useState(null)

        useEffect(() => {
            let isItems = true

            fetch(apiUrl + '/api/v1/get/orders?type=list', {
                method: 'get',
                mode: 'cors',
                headers: {
                    'authorization': apiKey,
                    'user-hash': sessionStorage.getItem('userHash')
                }
            })
                .then(response => {
                    response.json().then(json => {
                        if (json.success) {
                            isItems ? setItems(json) : setItems(null)
                        }
                    })
                })
                .catch(error => {
                    NotificationManager.error('???????????? ??????????????! ????????????????????, ???????????????????? ??????????', '????????????!');
                })

            return () => (isItems = false)
        }, [])

        if (!userAuthorized) {
            return (
                <Redirect to='/auth/'/>
            )
        } else if (items === null) {
            return (
                <main>
                    <section className='m-section'>
                        <h2 className='s-center'>????????????????...</h2>
                    </section>
                </main>
            )
        } else if (items.data.message) {
            return (
                <main>
                    <section className='m-section'>
                        <ProfileLinks/>
                        <div id='l-personal'>
                            <div id='l-personalOrders'>
                                <h2>???????????? ?????????????? ????????</h2>
                            </div>
                        </div>
                    </section>
                </main>
            )
        } else {
            return (
                <main>
                    <section className='m-section'>
                        <ProfileLinks/>
                        <div id='l-personal'>
                            <div id='l-personalOrders'>
                                <h2>???????????? ??????????????</h2>
                                {items.data.map(order => (
                                    <article key={order.number}>
                                        <div>
                                            <span>?????????? ????????????</span>
                                            <p>{order.number}</p>
                                        </div>
                                        <div>
                                            <span>???????? ????????????</span>
                                            <p>{order.date}</p>
                                        </div>
                                        <div>
                                            <span>???????????????????? ????????</span>
                                            <p>{order.day}</p>
                                        </div>
                                        <div>
                                            <span>?????????? ????????????</span>
                                            <p>{order.summ}</p>
                                        </div>
                                        <div>
                                            <span>???????????? ????????????</span>
                                            <p>{order.payment}</p>
                                        </div>
                                        <div>
                                            <span>???????????? ????????????</span>
                                            <p>{order.status}</p>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            )
        }
    }

    function Basket() {
        const [addresses, setAddresses] = useState(null)
        const [size, setSize] = useState(null)
        const [summ, setSumm] = useState(null)
        const [days, setDays] = useState(null)
        const [modalIsOpen, setIsOpen] = useState(false)
        const [addressChanged, setAddressChanged] = useState(0)

        useEffect(() => {
            let isAddresses = true

            fetch(apiUrl + '/api/v1/get/user', {
                method: 'get',
                mode: 'cors',
                headers: {
                    'authorization': apiKey,
                    'user-hash': sessionStorage.getItem('userHash')
                }
            })
                .then(response => {
                    response.json().then(json => {
                        if (json.success) {
                            isAddresses ? setAddresses(json) : setAddresses(null)
                        }
                    })
                })
                .catch(error => {
                    NotificationManager.error('???????????? ??????????????! ????????????????????, ???????????????????? ??????????', '????????????!');
                })

            setSize(sessionStorage.getItem('size'))
            setSumm(sessionStorage.getItem('summ'))
            setDays(sessionStorage.getItem('days'))

            return () => (isAddresses = false)
        }, [addressChanged])

        const order = e => {
            e.preventDefault()

            fetch(apiUrl + '/api/v1/post/orders?type=site', {
                method: 'post',
                mode: 'cors',
                headers: {
                    'authorization': apiKey,
                    'user-hash': sessionStorage.getItem('userHash')
                },
                body: new FormData(e.target)
            })
                .then(response => {
                    response.json().then(json => {
                        if (json.success) {
                            NotificationManager.success('???????????? ????????????????????!', '??????????')
                        }
                    })
                })
                .catch(error => {
                    NotificationManager.error('???????????? ??????????????! ????????????????????, ???????????????????? ??????????', '????????????!');
                })
        }

        const addAddress = e => {
            e.preventDefault()

            fetch(apiUrl + '/api/v1/post/address', {
                method: 'post',
                mode: 'cors',
                headers: {
                    'authorization': apiKey,
                    'user-hash': sessionStorage.getItem('userHash')
                },
                body: new FormData(e.target)
            })
                .then(response => {
                    response.json().then(json => {
                        if (json.success) {
                            setAddressChanged(addressChanged + 1)
                            closeModal()
                        } else {
                            var response = json.data;
                            $.each(response, function (key, value) {
                                NotificationManager.error(value + '' +
                                    '', '????????????!');
                            });
                        }
                    })
                })
                .catch(error => {
                    NotificationManager.error('???????????? ??????????????! ????????????????????, ???????????????????? ??????????', '????????????!');
                })
        }

        const openModal = () => {
            setIsOpen(true)
        }

        const closeModal = () => {
            setIsOpen(false)
        }

        if (!userAuthorized) {
            return (
                <Redirect to='/auth/'/>
            )
        } else if (addresses === null) {
            return (
                <main>
                    <section className='m-section'>
                        <h2 className='s-center'>????????????????...</h2>
                    </section>
                </main>
            )
        } else {
            return (
                <main>
                    <section className='m-section'>
                        <h2>???????????????????? ????????????</h2>
                    </section>
                    <form onSubmit={order}>
                        <input type='hidden' name='OrdersForm[size]' defaultValue={size}/>
                        <input type='hidden' name='OrdersForm[summ]' defaultValue={summ}/>
                        <input type='hidden' name='OrdersForm[day]' defaultValue={days}/>
                        <section className='t-grey m-section'>
                            <div id='l-basket'>
                                <article>
                                    <input type='date' name='OrdersForm[date]'/>
                                </article>
                                <article>
                                    <select name='OrdersForm[address]' defaultValue=''>
                                        <option value='' disabled>???????????????? ??????????:</option>
                                        {addresses.data.address.map(address => (
                                            <option key={address.id} value={address.address}>{address.address}</option>
                                        ))}
                                    </select>
                                    <button className='m-linkButton' onClick={openModal}>???????????????? ?????????? ??????????</button>
                                </article>
                                <article>
                                    <select name='OrdersForm[time]' defaultValue=''>
                                        <option value='' disabled>???????????????? ?????????? ????????????????:</option>
                                        <option value='8:00'>8:00</option>
                                        <option value='9:00'>9:00</option>
                                        <option value='10:00'>10:00</option>
                                        <option value='11:00'>11:00</option>
                                        <option value='12:00'>12:00</option>
                                    </select>
                                </article>
                                <article>
                                    <p>???????????? ????????????:</p>
                                    <div className='m-radioInput'>
                                        <input type='radio' name='OrdersForm[payment]' value='nocard' id='cash'/>
                                        <label htmlFor='cash'>??????????????????</label>
                                    </div>
                                    <div className='m-radioInput'>
                                        <input type='radio' name='OrdersForm[payment]' value='card' id='card'/>
                                        <label htmlFor='card'>???????????? ??????????????</label>
                                    </div>
                                </article>
                            </div>
                        </section>
                        <section className='m-section'>
                            <h2>??????????: {summ}??</h2>
                            <button type='submit'>???????????????? ??????????</button>
                        </section>
                    </form>
                    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} overlayClassName='m-modalOverlay'
                           className='m-modal'>
                        <button className='m-linkButton m-closeModalButton' onClick={closeModal}>&#10006;</button>
                        <h2>???????????????? ?????????? ??????????</h2>
                        <form id='l-modalAddressForm' onSubmit={addAddress}>
                            <article>
                                <input type='text' name='AddressForm[name]' placeholder='????????????????'/>
                            </article>
                            <article>
                                <input type='text' name='AddressForm[address]' placeholder='??????????'/>
                            </article>
                            <article>
                                <input type='text' name='AddressForm[driveway]' placeholder='??????????????'/>
                            </article>
                            <article>
                                <input type='text' name='AddressForm[apartment]' placeholder='????????????????'/>
                            </article>
                            <article>
                                <input type='text' name='AddressForm[intercom]' placeholder='??????????????'/>
                            </article>
                            <article>
                                <input type='text' name='AddressForm[story]' placeholder='????????'/>
                            </article>
                            <button type='submit'>??????????????????</button>
                        </form>
                    </Modal>
                </main>
            )
        }
    }

    return (
        <Router>
            <Header/>
            <Switch>
                <Route path='/auth/'>
                    <Auth/>
                </Route>
                <Route path='/profile/'>
                    <Profile/>
                </Route>
                <Route path='/orders/'>
                    <Orders/>
                </Route>
                <Route path='/basket/'>
                    <Basket/>
                </Route>
                <Route path='/'>
                    <Mainpage/>
                </Route>
            </Switch>
            <NotificationContainer/>
            <Footer/>
        </Router>
    )
}

