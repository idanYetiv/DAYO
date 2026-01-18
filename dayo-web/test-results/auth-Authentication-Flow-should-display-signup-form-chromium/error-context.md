# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications alt+T"
  - generic [ref=e5]:
    - generic [ref=e6]:
      - heading "DAYO" [level=1] [ref=e7]
      - paragraph [ref=e8]: Start your journey today
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e11]: Email
        - textbox "Email" [ref=e12]:
          - /placeholder: you@example.com
      - generic [ref=e13]:
        - generic [ref=e14]: Password
        - textbox "Password" [ref=e15]:
          - /placeholder: At least 6 characters
      - generic [ref=e16]:
        - generic [ref=e17]: Confirm Password
        - textbox "Confirm Password" [ref=e18]:
          - /placeholder: ••••••••
      - button "Create Account" [ref=e19] [cursor=pointer]
    - generic [ref=e22]: or
    - button "Continue with Google" [ref=e24] [cursor=pointer]:
      - img [ref=e25]
      - text: Continue with Google
    - paragraph [ref=e30]:
      - text: Already have an account?
      - link "Sign in" [ref=e31] [cursor=pointer]:
        - /url: /login
```