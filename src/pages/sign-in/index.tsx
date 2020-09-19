import React from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import { AuthSide, AuthLogo, AuthTitle, AuthDesc, AuthLink, AuthField, AuthPlaceholder, AuthInput, Checkbox, CheckboxField } from "../../components/style"
import { Link, navigate } from "gatsby"

import { ButtonV2 } from '../../components/ButtonV2'

import UserController from "../../controllers/User"

import { ErrorJSON } from "../../types"

import { parse } from "search-params";
import { Thinker } from "../../components/Thinker"

const SigninPage = ({ location }) => {
    const params = parse(location.search)

    const emailRef = React.createRef<HTMLInputElement>();
    const passwordRef = React.createRef<HTMLInputElement>();
    const rememberMeRef = React.createRef<HTMLInputElement>();

    const [done, sd] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const [pst, setPST] = React.useState(null);
    const [passwordStrength, setPasswordStrength] = React.useState(-1);

    const user = new UserController();

    React.useEffect(() => {
        sd(true)

        if(!params.next) navigate(location.pathname + "?next=/me");
    })

    const onSignInClick = () => {
        if(!emailRef || !passwordRef || !rememberMeRef || !emailRef.current || !passwordRef.current || !rememberMeRef.current) return;

        setLoading(true);

        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const rememberMe = rememberMeRef.current.checked;

        user.login({ email, password }).then((r: ErrorJSON) => {
            setLoading(false);

            if(r.ok) {
                if(rememberMe) console.log("Remembering you.")
                else console.log("I'm a little forgetful, so I won't be remembering you.")

                const next = ((params.next as string).startsWith("/") && !(params.next as string).includes(".") ? params.next : "/" as string);

                navigate(params.next ? (next as string) : "/");
            }
        }).catch(e => {
            console.error(e);
        });
    }

    const onPasswordKeyUp = () => {
        if(!passwordRef || !passwordRef.current) return;

        const password = passwordRef.current.value;

        clearTimeout(pst);

        var timeout = setTimeout(() => {
            user.getPasswordStrength(password).then((r: any) => {
                if(r.ok && r.data.result) {
                    const { strength } = r.data.result;
    
                    setPasswordStrength(strength);
                } else setPasswordStrength(-1);
            }).catch(e => {
                console.error(e);
                setPasswordStrength(-1);
            });
        }, 200);

        setPST(timeout);
    }
    
    return (
        <Layout blank noEnding noHero>
            <SEO title="Sign in to your existing Dot ID" />
            <div style={{ display: 'flex' }}>
                <div style={{ width: '870px', height: '100vh', minWidth: '870px', padding: '0 100px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ transform: done ? 'translateX(0px)' : 'translateX(-25px)', opacity: done ? 1 : 0, transition: '0.3s opacity, 0.3s transform' }}>
                        <div>
                            <AuthLogo />
                            <AuthTitle>Welcome back.</AuthTitle>
                            <AuthDesc>Sign in to your existing Dot ID. Don’t have a Dot ID yet? <Link to={"/sign-up"}><AuthLink>Create one here!</AuthLink></Link></AuthDesc>
                        </div>

                        <div style={{ marginTop: '92px', opacity: loading ? 0.5 : 1, transition: "0.3s opacity", pointerEvents: loading ? "none" : "all" }}>
                            <AuthField style={{ width: '525px' }}>
                                <AuthInput placeholder={" "} ref={emailRef} />
                                <AuthPlaceholder>Email Address</AuthPlaceholder>
                            </AuthField>

                            <AuthField style={{ marginTop: '18px', width: '525px' }} passwordStrength={passwordStrength}>
                                <AuthInput placeholder={" "} type={"password"} ref={passwordRef} onKeyUp={() => onPasswordKeyUp()} />
                                <AuthPlaceholder>Password</AuthPlaceholder>
                            </AuthField>

                            <div style={{ display: 'flex', width: '525px', marginTop: '45px' }}>
                                <Checkbox style={{ flex: '1' }}>
                                    <CheckboxField type={"checkbox"} ref={rememberMeRef} />
                                    <label>Remember my session</label>
                                </Checkbox>

                                <AuthLink style={{ display: 'flex', fontSize: '15px' }}>Forgot your password?</AuthLink>
                            </div>

                            <div style={{ marginTop: '45px', display: 'flex', flexDirection: 'column' }}>
                                <ButtonV2 
                                    w={525} 
                                    h={58} 
                                    background={"#4965FF"} 
                                    br={8} 
                                    fs={18} 
                                    onClick={() => onSignInClick()}
                                    loading={loading}
                                >
                                    Sign in
                                </ButtonV2>

                                <span style={{ margin: '14px auto', fontSize: '15px', color: '#656565' }}>or</span>

                                <Link to={"/sso/github"}>
                                    <ButtonV2 w={525} h={58} background={"transparent"} color={"black"} br={8} fs={18} style={{ border: '2px solid #D2D2D2' }} loadOnClick>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '32px' }}><img style={{ margin: 0, marginRight: '14px' }} src={require("../../images/github.svg")} />Sign in with GitHub</div>
                                    </ButtonV2>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <AuthSide />
            </div>
        </Layout>
    )
}

export default SigninPage
