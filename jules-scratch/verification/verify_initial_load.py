from playwright.sync_api import sync_playwright, Page

def run_verification(page: Page):
    """
    This script navigates to the app and takes a screenshot of the initial load
    to debug why elements are not visible.
    """
    page.goto("http://localhost:5173/")
    page.wait_for_timeout(2000) # Wait 2 seconds for any JS to execute
    page.screenshot(path="jules-scratch/verification/initial_load.png")
    print("--- PAGE HTML CONTENT ---")
    print(page.content())
    print("--- END PAGE HTML CONTENT ---")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()
