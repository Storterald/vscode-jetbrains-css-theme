function observeDiv(identifier: string, callback: CallableFunction): void {

        function createObserver(element: Element): MutationObserver | null {
                if (!element) {
                        console.error("Cannot create observer with null element.");
                        return null;
                }

                const observer = new MutationObserver(() => {
                        console.info(`Mutation detected for element [${identifier}]`);
                        callback(element);
                });

                // Observe the parent
                observer.observe(element.parentElement!, {
                        childList: false,
                        attributes: true,
                        subtree: false
                });

                console.log(`Observer created for element [${identifier}].`);
                return observer;
        }

        function waitForDiv(): Promise<Element> {
                return new Promise((resolve, reject) => {
                        const timeout = 5000; // ms
                        const interval = 100; // ms

                        const startTime = Date.now();
                        const checkExist = () => {
                                const element = document.querySelector(identifier);
                                if (element)
                                        resolve(element);
                                else if (Date.now() - startTime > timeout)
                                        reject(`Timeout: Element [${identifier}] not found within ${timeout}ms`);
                                else
                                        setTimeout(checkExist, interval);
                        };

                        checkExist();
                });
        }

        waitForDiv().then((element: Element) => {
                callback(element);

                const observer = createObserver(element);
        }).catch((error: Error) => {
                console.error(error);
        });
}


function moveBreadcrumbs(element: Element): void {
        const breadcrumbs = element.querySelector(".monaco-breadcrumbs");
        const editor = document.querySelector("#workbench\\.parts\\.editor");

        if (!breadcrumbs || !editor)
                return;

        // Add custom container
        // TODO: remove and move Element
        let breadcrumbsContainer = document.querySelector("#storterald-breadcrumbs-container");
        if (!breadcrumbsContainer) {
                breadcrumbsContainer = document.createElement("div");
                breadcrumbsContainer.id = "storterald-breadcrumbs-container";
                editor.appendChild(breadcrumbsContainer);
        }

        breadcrumbsContainer.appendChild(breadcrumbs);
}

function addActionsLabels(element: Element): void {
        element.querySelectorAll(".active-item-indicator")?.forEach((el) => {
                el.setAttribute("tabindex", "0");
        });

        const project = element.querySelector(".codicon-explorer-view-icon");
        if (project) {
                const p = document.createElement("p");
                p.appendChild(document.createTextNode("Project"));
                p.id = "storterald-btn-text";
                project.appendChild(p);
        }

        const commit = element.querySelector(".codicon-source-control-view-icon");
        if (commit) {
                const p = document.createElement("p");
                p.appendChild(document.createTextNode("Commit"));
                p.id = "storterald-btn-text";
                commit.appendChild(p);
        }

        const find = element.querySelector(".codicon-search-view-icon");
        if (find) {
                const p = document.createElement("p");
                p.appendChild(document.createTextNode("Find"));
                p.id = "storterald-btn-text";
                find.appendChild(p);
        }

        const plugins = element.querySelector(".codicon-extensions-view-icon");
        if (plugins) {
                const p = document.createElement("p");
                p.appendChild(document.createTextNode("Plugins"));
                p.id = "storterald-btn-text";
                plugins.appendChild(p);
        }
}

observeDiv(".breadcrumbs-below-tabs", moveBreadcrumbs)
observeDiv(".monaco-action-bar.vertical", addActionsLabels)