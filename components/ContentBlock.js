import { Button, Chip, TextField } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { CB_LOCALE } from "../locale/cb"
import { useRouter } from "next/router"
import { pzTrack } from "../lib/helpers"

export const ContentBlock = (props) => {
  const [subscribed, setSubscribed] = useState(false)
  const { locale: orig } = useRouter()
  const locale = orig === "default" ? "en" : orig
  const localization = CB_LOCALE[props.type][locale] || CB_LOCALE[props.type]["default"]

  const handleOnSubmit = async (e) => {
    //e.preventDefault()
    const formData = new FormData(e.target)
    const dataObj = Object.fromEntries(formData.entries())

    const data = new URLSearchParams(formData);
    const url = 'https://purizu.us10.list-manage.com/subscribe/post'

    const res = await fetch(url, {
      mode: 'no-cors',
      method: 'post',
      body: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    setSubscribed(true)
    window.localStorage.setItem("general sub", true)

    pzTrack('form_submitted', {
      email: dataObj['MERGE0'],
      mId: dataObj['id'],
      mU: dataObj['u']
    })
  }

  useEffect(() => {
    if (!!window.localStorage.getItem("general sub")) setSubscribed(true)
  }, [])

  if (props.type === 'newsletterForm') {
    if (subscribed) return (<div>
      <Chip color="success" label={localization["already"]} />
    </div>)
    return <form onSubmit={handleOnSubmit} action="https://purizu.us10.list-manage.com/subscribe/post" method="POST" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', width: '100%', maxWidth: '80vw' }} target="_blank">
      <input type="hidden" name="u" value="eef41a522049e21e6befd040e" />
      <input type="hidden" name="id" value="80a6fc44a4" />
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', flexBasis: '100%' }}>
        <TextField fullWidth size="small" sx={{ marginY: 0 }} required label={'Email'} type="email" autoCapitalize="none" autocorrect="off" name="MERGE0" placeholder="youremail@gmail.com" />
      </div>
      <input type="hidden" name="MERGE2" id="MERGE2" size="25" value={"newsletter launch promo"}></input>
      <input type="hidden" name="MERGE3" id="MERGE3" size="25" value={locale}></input>
      <Button size="medium" type="submit" sx={{ marginTop: 1, flexBasis: '100%', height: '100%' }} fullWidth variant="outlined">{localization["submit"]}</Button>
    </form>
  }

  return null
}